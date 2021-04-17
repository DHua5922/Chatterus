interface Login {
    usernameOrEmail: string
    password: string
}

interface Load {
    isPending: boolean
    success: any
    error: any
}

export type {
    Login,
    Load
}