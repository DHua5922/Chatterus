interface Login {
    usernameOrEmail: string
    password: string
}

interface Load {
    isPending: boolean
    success: any
    error: any
}

interface Registration {
    username: string
    email: string
    password: string
    cpassword: string
}

export type {
    Login,
    Load,
    Registration
}