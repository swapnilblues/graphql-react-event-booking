const Event = require('../../models/event')
const { dateToString } = require('../../helpers/date')
const {transformEvent} = require("./merge")

module.exports = {
    events: async () => {
        const events = await Event.find()
        try {
            return events.map(event => {
                return transformEvent(event)
            })
        } catch (err) {
            throw err
        }
    },

    createEvent: async (args) => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: dateToString(args.eventInput.date),
            creator: '5fa8620042ebf06488303631'
        })
        let createdEvent
        try {
            const result = await event
                .save()
            createdEvent = transformEvent(event)
            const creator = await User.findById('5fa8620042ebf06488303631')


            if (!creator) {
                throw new Error("User not found.")
            }
            creator.createdEvents.push(event)
            await creator.save()

            return createdEvent
        } catch (err) {
            throw err
        }
    }
}