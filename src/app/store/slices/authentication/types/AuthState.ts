import User from '../../../../types/user'

type AuthState = {
  currentUser: User | null
  errorMessage: string | null
  loading: boolean
}

export default AuthState
