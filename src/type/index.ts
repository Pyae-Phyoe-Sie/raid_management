interface ILoginUser {
    id: string,
    name?: string,
    password?: string,
    role?: string,
}

interface IUser {
    id: string,
    name?: string,
    role?: string,
}

interface IRole {
    id: string,
    name: string,
}

interface ISchedule {
    id: string,
    raid: string,
    date: {
        seconds: number,
        nanoseconds: number
    },
    signups: number,
}

interface ISignUp {
    schedule_id: string
    time: {
        seconds: number,
        nanoseconds: number
    },
    user_id: string
    user_name: string
}