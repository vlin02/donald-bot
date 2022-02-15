import { CacheType, CommandInteraction } from 'discord.js'
import {
    currentSectionAction,
    fetchSectionStatus,
    SectionAction,
    sectionAsString,
    SectionIdentifier,
    SectionStatus
} from './status'

interface Section {
    identifier: SectionIdentifier
    status: SectionStatus | null
}

class Tracker {
    trackedSections: Section[]
    interaction: CommandInteraction<CacheType>
    intervalId: NodeJS.Timer | null
    frequency: number

    readableAction: Record<SectionAction, string> = {
        [SectionAction.ENROLL]: 'enrollment seats',
        [SectionAction.WAITLIST]: 'waitlist seats',
        [SectionAction.NONE]: 'no seats left',
        [SectionAction.UNKNOWN]: 'unknown status'
    }

    constructor(
        interaction: CommandInteraction<CacheType>,
        frequency: number = 20 * 1000
    ) {
        this.interaction = interaction
        this.frequency = frequency
        this.reset()
    }

    async updateStatuses() {
        const newStatuses = await Promise.all(
            this.trackedSections.map((section) =>
                fetchSectionStatus(section.identifier)
            )
        )

        this.trackedSections.forEach((section, index) => {
            this.sendDiff(section, newStatuses[index])
        })

        this.trackedSections = this.trackedSections.map((section, index) => {
            return {
                ...section,
                status: newStatuses[index]
            }
        })
    }

    startTracking() {
        this.intervalId = setInterval(() => {
            this.updateStatuses()
        }, this.frequency)
    }

    sendDiff(section: Section, newStatus: SectionStatus | null) {
        const { channel } = this.interaction

        const [oldAction, newAction] = [section.status, newStatus].map(
            (section) =>
                section ? currentSectionAction(section) : SectionAction.UNKNOWN
        )

        if (oldAction !== newAction) {
            channel?.send(
                `[UPDATE] ${sectionAsString(section.identifier)} has ${
                    this.readableAction[newAction]
                }`
            )
        }
    }

    addSection(identifier: SectionIdentifier) {
        if (!this.intervalId) this.startTracking()
        this._addSection(identifier)
    }

    _addSection(identifier: SectionIdentifier) {
        this.trackedSections.push({
            identifier,
            status: null
        })
    }

    reset() {
        this.trackedSections = []
        if (this.intervalId) clearInterval(this.intervalId)
        this.intervalId = null
    }
}

export class Session {
    trackers: Record<string, Tracker> = {}

    get(interaction: CommandInteraction<CacheType>) {
        const { channelId } = interaction

        if (!channelId) throw Error('no channel found')

        if (!(channelId in this.trackers)) {
            this.trackers[channelId] = new Tracker(interaction)
        }

        return this.trackers[channelId]
    }
}