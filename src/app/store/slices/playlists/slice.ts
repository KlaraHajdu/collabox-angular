import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import getYoutubeId from 'get-youtube-id'
import PlaylistsState from './types/PlaylistsState'
import { firestoreApi } from '../../../services/firestore/firestoreApi'
import checkIfVideoDurationIsOk  from '../../../utils/checkIfVideoDurationIsOk'
import getVideoDetails from '../../../utils/youtubeApi'
import RootState from '../../RootState'
import Playlist from '../../../types/Playlist'
import PlaylistData from '../../../types/PlaylistData'
import Song from '../../../types/Song'
import PlaylistType from '../../../types/PlaylistType'
import VoteType from '../../../types/VoteType'


const initialState: PlaylistsState = {
    ownPlaylists: null,
    otherPlaylists: null,
    currentPlaylist: null,
    loading: {
        createPlaylistLoading: false,
        followPlaylistLoading: false,
        addSongLoading: false,
    }
}

const createPlaylist = createAsyncThunk<
string,
string,
{ state: RootState }
>
('playlists/createPlaylist',
    async (payload: string, thunkApi) => {
        const state = thunkApi.getState()
        const { authentication } = state
        const {currentUser} = authentication
        const playlistName = payload
        try {
            const id = await firestoreApi.createPlaylist(currentUser!.id, currentUser!.name, playlistName)
            return id
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    })

const deletePlaylist = createAsyncThunk<
string,
string,
{ state: RootState }
>
('playlists/deletePlaylist',
    async (payload: string, thunkApi) => {
        const state = thunkApi.getState()
        const {authentication} = state
        const {currentUser} = authentication
        const {playlists} = state
        if(!playlists.currentPlaylist) {
            return thunkApi.rejectWithValue('no_current_playlist')
        }
        const { currentPlaylist } = playlists
        const {followers} = currentPlaylist
        const playlistId = payload
        try {
            const resp = await firestoreApi.deletePlaylist(currentUser!.id, playlistId, followers)
            return 'playlist_deleted'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    })

const verifyUrl = createAsyncThunk<
    string,
    string,
    { state: RootState }
    >
    ('playlists/verifyUrl',
    async (payload: string, thunkApi) => {
            const url = payload
            const youtubeId = getYoutubeId(url)
            if (!youtubeId) {
                return thunkApi.rejectWithValue("no_youtube_url")
            }
            const videoDetails = await getVideoDetails(youtubeId)

            const videoDurationIsOk = checkIfVideoDurationIsOk(videoDetails.duration)
            if (!videoDurationIsOk) {
                return thunkApi.rejectWithValue("video_too_long")
            }
            thunkApi.dispatch(checkIfSongExists({youtubeId, title: videoDetails.title}))
            return "url_verified"
    })

const addSong = createAsyncThunk<
    string,
    {youtubeId: string, title: string},
    { state: RootState }
    >
    ('playlists/addSong',
        async (payload, thunkApi) => {
            const state = thunkApi.getState()
            const { authentication } = state
            const { currentUser } = authentication
            if (!currentUser) {
                return thunkApi.rejectWithValue("no_currentUser")
            }
            const userId = currentUser?.id
            const userName = currentUser.name

            const { playlists } = state
            const { currentPlaylist } = playlists
            if (!currentPlaylist) {
                return thunkApi.rejectWithValue("no_currentPlaylist")
            }
            const playlistId = currentPlaylist?.id
            const { youtubeId, title } = payload
            const song: Omit<Song, 'id' | 'downVoted' | 'upVoted'> = {
                youtubeId,
                title,
                votes: 0,
                userId,
                userName,
            }
            try {
                await firestoreApi.addSong(playlistId, song)
                return 'song_added'
            } catch (error) {
                return thunkApi.rejectWithValue('database_error')
            }
    })

const checkIfSongExists  = createAsyncThunk<
string,
{youtubeId: string, title: string},
{ state: RootState }
>
('playlists/checkIfSongExists',
    async (payload, thunkApi) => {
        const state = thunkApi.getState()
        const { playlists } = state
        const { currentPlaylist } = playlists
        if (!currentPlaylist) {
            return thunkApi.rejectWithValue("no_currentPlaylist")
        }
        const playlistId = currentPlaylist.id
        const { youtubeId, title } = payload
        try{
            const songExists = await firestoreApi.checkIfSongExists(playlistId, youtubeId)
            if (songExists) {
                return thunkApi.rejectWithValue('duplicate_song')
            }
            thunkApi.dispatch(addSong({youtubeId, title}))
            return 'not_duplicate_song'

        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
})

const deleteSong = createAsyncThunk<
    string,
    string,
    { state: RootState }
    >
    ('playlists/deleteSong',
        async (payload, thunkApi) => {
            const state = thunkApi.getState()
            const { playlists } = state
            const { currentPlaylist } = playlists
            if (!currentPlaylist) {
                return thunkApi.rejectWithValue("no_currentPlaylist")
            }
            const playlistId = currentPlaylist.id
            const {owner, followers} = currentPlaylist
            const songId = payload
            try {
                await firestoreApi.deleteSong(playlistId, songId, owner, followers )
                return 'song_deleted'
            } catch (error) {
                return thunkApi.rejectWithValue('database_error')
            }
    })

const vote = createAsyncThunk<
string,
{songId: string, voteType: VoteType, playlistType: PlaylistType},
{ state: RootState }
>
('playlists/vote',
    async (payload, thunkApi) => {
        const state = thunkApi.getState()
        const {authentication} = state
        const { currentUser } = authentication
        const { playlists } = state
        const { currentPlaylist } = playlists
        const playlistId = currentPlaylist!.id
        const {songId, voteType, playlistType } = payload

        const voteStatus: number = await firestoreApi.checkVoteStatus(currentUser!.id, playlistId, songId, playlistType)
        if ( voteStatus === voteType ) {
            return thunkApi.rejectWithValue('already_voted')
        }
        try {
            const voteChange = voteType * (Math.abs(voteStatus) + Math.abs(voteType))
            await firestoreApi.vote(currentUser!.id, playlistId, songId, voteChange, voteType, playlistType)
            return 'voted_on_song'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
})

const followPlaylist = createAsyncThunk<
string,
string,
{ state: RootState }
>
('playlists/followPlaylist',
    async (payload: string, thunkApi) => {
        const state = thunkApi.getState()
        const { authentication } = state
        const {currentUser} = authentication
        const playlistId = payload
        try {
            const {playlists} = state
            const {ownPlaylists} = playlists
            const ownPlaylistIds = ownPlaylists.map(pl => pl.id)
            if (ownPlaylistIds.includes(playlistId)) {
              return thunkApi.rejectWithValue('own_playlist')
            }
            const playlistDetails: any = await firestoreApi.getPlaylistDetails(playlistId)
            if (!playlistDetails) {
                return thunkApi.rejectWithValue('no_such_playlist')
            }
            const {ownerName, playlistName } = playlistDetails
            await firestoreApi.followPlaylist(currentUser!.id, ownerName, playlistId, playlistName)
            return 'playlist_followed'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    })

const unfollowPlaylist = createAsyncThunk<
    string,
    string,
    { state: RootState }
    >
    ('playlists/unfollowPlaylist',
        async (payload: string, thunkApi) => {
            const state = thunkApi.getState()
            const { authentication } = state
            const {currentUser} = authentication
            const playlistId = payload
            try {
                await firestoreApi.unfollowPlaylist(currentUser!.id, playlistId)
                return 'playlist_unfollowed'
            } catch (error) {
                return thunkApi.rejectWithValue('database_error')
            }
        })

const updatePartySong = createAsyncThunk<
    string,
    {playlistId: string, currentSong: Pick<Song, 'youtubeId' | 'title'>},
    {state: RootState}
    >('playlists/updatePartySong',
        async (payload: {playlistId: string, currentSong: Pick<Song, 'youtubeId' | 'title'>}, thunkApi) => {
            const { playlistId, currentSong } = payload;
            try{
                await firestoreApi.updatePartySong(playlistId, currentSong.youtubeId, currentSong.title)
                return 'partysong_updated'
            } catch{
                return thunkApi.rejectWithValue('database_error')
            }
})

const endParty = createAsyncThunk<
    string,
    string,
    {state: RootState}
    >('playlists/endParty',
        async (payload: string, thunkApi) => {
            const playlistId = payload;
            try{
                await firestoreApi.endParty(playlistId)
                return 'party_ended'
            } catch{
                return thunkApi.rejectWithValue('database_error')
            }
})

const changePlaylistTitle = createAsyncThunk<
    string,
    {newTitle: string, playlistId: string},
    {state: RootState}
    >('playlists/changeName',
        async (payload: {newTitle: string, playlistId: string}, thunkApi) => {
            const { playlistId, newTitle } = payload
            const state = thunkApi.getState()
            const {playlists, authentication} = state
            const {currentUser} = authentication
            if(!playlists.currentPlaylist) {
                return thunkApi.rejectWithValue('no_current_playlist')
            }
            const { currentPlaylist } = playlists
            const {followers} = currentPlaylist
                try {
                    await firestoreApi.changeTitle(playlistId, newTitle, currentUser!.id, followers)
                    return payload.newTitle;
                } catch {
                    return thunkApi.rejectWithValue('database_error')
                }
        }
    )

const toggleLockStatus = createAsyncThunk<
    string,
    {playlistId: string, newLockStatus: boolean},
    {state: RootState}
    >('playlists/toggleLockStatus',
        async (payload: {playlistId: string, newLockStatus: boolean}, thunkApi) => {
            const { playlistId, newLockStatus } = payload
            try {
                await firestoreApi.toggleLockStatus(playlistId, newLockStatus)
                return 'lockStatus_toggled';
            } catch {
                return thunkApi.rejectWithValue('database_error')
            }
        }
    )

const slice = createSlice({
    name: 'playlists',
    initialState,
    reducers: {
        SET_PLAYLIST: (state, action: PayloadAction<Playlist>) => {
            const currentPlaylistProperties = action.payload
            const newState: any = {...currentPlaylistProperties, songs: state?.currentPlaylist?.songs}
            state.currentPlaylist = newState
        },
        SET_OWN_PLAYLISTS: (state, action: PayloadAction<Pick<PlaylistData, 'id'| 'playlistName'>[]>) => {
            state.ownPlaylists = action.payload
        },
        SET_OTHER_PLAYLISTS: (state, action: PayloadAction<PlaylistData[]>) => {
            state.otherPlaylists = action.payload
        },
        SET_SONGS: (state, action: PayloadAction<Song[]>) => {
            state.currentPlaylist!.songs = action.payload
        },
    },
    extraReducers: {
        [createPlaylist.pending.type]: (state) => {
            state.loading.createPlaylistLoading = true
        },
        [createPlaylist.fulfilled.type]: (state) => {
            state.loading.createPlaylistLoading = false
        },
        [createPlaylist.rejected.type]: (state) => {
            state.loading.createPlaylistLoading = false
        },
        [followPlaylist.pending.type]: (state) => {
            state.loading.followPlaylistLoading = true
        },
        [followPlaylist.fulfilled.type]: (state) => {
            state.loading.followPlaylistLoading = false
        },
        [followPlaylist.rejected.type]: (state) => {
            state.loading.followPlaylistLoading = false
        },
        [addSong.pending.type]: (state) => {
            state.loading.addSongLoading = true
        },
        [addSong.fulfilled.type]: (state) => {
            state.loading.addSongLoading = false
        },
        [addSong.rejected.type]: (state) => {
            state.loading.addSongLoading = false
        }
    }
})

const subscribeToOwnPlaylists = createAsyncThunk<
    string,
    null,
    { state: RootState } >
    ('playlists/subscribeToOwnPlaylists',
    async (payload, thunkApi) => {
        const state = thunkApi.getState()
        const {authentication} = state;
        const {currentUser} = authentication;
        const {id} = currentUser;
        const observer = (playlists: Pick<PlaylistData, 'id'| 'playlistName'>[]) => {
            thunkApi.dispatch(slice.actions.SET_OWN_PLAYLISTS(playlists))
        }
        try {
            await firestoreApi.subscribeToOwnPlaylists(id, observer)
            return 'subscribed_to_own_playlists'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
})

const unsubscribeFromOwnPlaylists = createAsyncThunk<
    string,
    string,
    { state: RootState } >(
    'playlists/unsubscribeFromOwnPlaylists',
        async (payload, thunkApi) => {
        const id = payload;

        try {
            await firestoreApi.unsubscribeFromOwnPlaylists(id)
            return 'unsubscribed_from_own_playlists'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    }
)

const subscribeToOtherPlaylists = createAsyncThunk<
    string,
    string,
    { state: RootState } >
    ('playlists/subscribeToOtherPlaylists',
    async (payload, thunkApi) => {
        const userId = payload;
        const observer = (playlists: any[]) => {
            thunkApi.dispatch(slice.actions.SET_OTHER_PLAYLISTS(playlists))
        }
        try {
            await firestoreApi.subscribeToOtherPlaylists(userId, observer)
            return 'subscribed_to_other_playlists'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
})

const unsubscribeFromOtherPlaylists = createAsyncThunk<
    string,
    string,
    { state: RootState } >(
    'playlists/unsubscribeFromOtherPlaylists',
        async (payload, thunkApi) => {
        const id = payload;

        try {
            await firestoreApi.unsubscribeFromOtherPlaylists(id)
            return 'unsubscribed_from_other_playlists'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    }
)

const subscribeToPlaylist = createAsyncThunk<
    string,
    string,
    { state: RootState } >(
    'playlists/subscribeToPlaylist',
        async (payload, thunkApi) => {
        const id = payload;

        const observer = (playlist: Playlist) => {
            thunkApi.dispatch(slice.actions.SET_PLAYLIST(playlist))
        }
        try {
            await firestoreApi.subscribeToPlaylist(id, observer)
            return 'subscribed_to_playlist'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    }
)

const unsubscribeFromPlaylist = createAsyncThunk<
    string,
    string,
    { state: RootState } >(
    'playlists/unsubscribeFromPlaylist',
        async (payload, thunkApi) => {
        const id = payload;

        try {
            await firestoreApi.unsubscribeFromPlaylist(id)
            return 'unsubscribed_from_playlist'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    }
)

const subscribeToSongsCollection = createAsyncThunk<
    string,
    string,
    { state: RootState } >(
    'playlists/subscribeToSongsCollection',
        async (payload, thunkApi) => {
        const id = payload;

        try {
            const observer = (songs: Song[]) => {
                thunkApi.dispatch(slice.actions.SET_SONGS(songs))
            }
            await firestoreApi.subscribeToSongsCollection(id, observer)
            return 'subscribed_to_songscollection'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    }
)

const unsubscribeFromSongsCollection = createAsyncThunk<
    string,
    string,
    { state: RootState } >(
    'playlists/unsubscribeFromSongsCollection',
        async (payload, thunkApi) => {
        const id = payload;

        try {
            await firestoreApi.unsubscribeFromSongsCollection(id)
            return 'unsubscribed_from_songscollection'
        } catch (error) {
            return thunkApi.rejectWithValue('database_error')
        }
    }
)

export default slice.reducer

export const playlistsActions = slice.actions

export const name = slice.name


export const playlistsAsyncActions = {
    subscribeToPlaylist,
    unsubscribeFromPlaylist,
    subscribeToSongsCollection,
    unsubscribeFromSongsCollection,
    createPlaylist,
    deletePlaylist,
    subscribeToOwnPlaylists,
    unsubscribeFromOwnPlaylists,
    subscribeToOtherPlaylists,
    unsubscribeFromOtherPlaylists,
    verifyUrl,
    addSong,
    checkIfSongExists,
    deleteSong,
    vote,
    followPlaylist,
    unfollowPlaylist,
    updatePartySong,
    endParty,
    changePlaylistTitle,
    toggleLockStatus
}
