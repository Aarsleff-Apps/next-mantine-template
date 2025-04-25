export {}

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      jobTitle?: string
      department?: string
      admin?: boolean
    }
  }
}