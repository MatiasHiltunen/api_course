
export const tableDogs = 'dogs' as const

export interface DogCreate {
    name: string
    age: number
    image: string
}

export interface Dog {
    id: string
    name: string
    age: number
    image: string
}