import { Section } from '../models/section'
import { Database } from '../utils/database'
import { SectionPage } from '../scrapers/pages/section'
import { parseSectionStatus } from '../scrapers/parsers/section-status'
import { ServiceResult } from '../utils/types'

export interface AddTicketProps {
    discordId: string
    sectionKey: string
    db: Database
}

export type AddTicketError = {
    code:
        | 'EXISTING_TICKET_FOUND'
        | 'MAX_TICKET_LIMIT_REACHED'
        | 'SECTION_NOT_FOUND'
}

export type AddTicketPayload = {
    section: Section
}

export type AddTicketServiceResult = ServiceResult<
    AddTicketPayload,
    AddTicketError
>

export async function AddTicketService({
    discordId,
    sectionKey,
    db
}: AddTicketProps): Promise<AddTicketServiceResult> {
    // validate user can add ticket
    const user = await db.users.findOne({
        discordId
    })

    if (user) {
        if (user.tickets.includes(sectionKey)) {
            return {
                success: false,
                payload: {
                    code: 'EXISTING_TICKET_FOUND'
                }
            }
        } else if (user.tickets.length >= 10) {
            return {
                success: false,
                payload: {
                    code: 'MAX_TICKET_LIMIT_REACHED'
                }
            }
        }
    }

    // create section if not existing
    let section: Section = await db.sections.findOne({
        key: sectionKey
    })

    if (!section) {
        const page = new SectionPage(sectionKey)
        const html = await page.retrieveHTML()

        if (!html.match(/expand all classes/i)) {
            return {
                success: false,
                payload: {
                    code: 'SECTION_NOT_FOUND'
                }
            }
        }

        section = {
            key: sectionKey,
            status: parseSectionStatus(html)
        }

        await db.sections.insertOne(section)
    }

    // add ticket to user
    if (user) {
        await db.users.updateOne(
            {
                discordId
            },
            {
                $push: {
                    tickets: sectionKey
                }
            }
        )
    } else {
        await db.users.insertOne({
            discordId,
            tickets: [sectionKey]
        })
    }

    return {
        success: true,
        payload: {
            section
        }
    }
}
