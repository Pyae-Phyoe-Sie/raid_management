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
    freeze: boolean,
    date: {
        seconds: number,
        nanoseconds: number
    },
    time?: string,
    signups: number,
}

interface ISignUp {
    id: string
    schedule_id: string
    time: {
        seconds: number,
        nanoseconds: number
    },
    user_id: string
    user_name: string
}