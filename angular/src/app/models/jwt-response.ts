export interface JwtResponseI {
    success: boolean,
    message: string,
    data: {
        accessToken: string,
        expiresIn: string
    }
}
