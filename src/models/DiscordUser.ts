import { User } from "discord.js"
import { collections } from "../database"
import { ValidationResult } from "../types"

export async function canAddTicket(
    user: User,
    sectionKey: string
): Promise<ValidationResult> {
    const [ticketCount, existingTicket] = await Promise.all([
        collections.tickets?.count({
            userId: user.id
        }),
        collections.tickets?.findOne({
            userId: user.id,
            sectionKey
        })
    ])

    if ((ticketCount ?? 10) >= 10) {
        return {
            message: ':x:  You have reached the ticket limit (10)',
            value: false
        }
    }

    if (existingTicket) {
        return {
            message: `:x: You already have a ticket for **${sectionKey}**`,
            value: false
        }
    }

    return { value: true }
}