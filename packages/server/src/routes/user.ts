import { Router, Request } from "express"
import TicketService from "../services/ticket"

const userRouter = Router()

type AddTicketRequest = Request<
  {
    discordId: string
  },
  any,
  {
    sectionKey: string
  }
>

userRouter.post(
  "/:discordId/add-ticket",
  async (req: AddTicketRequest, res, next) => {
    const ticketer = new TicketService()

    const { discordId } = req.params
    const { sectionKey } = req.body

    try {
      const response = await ticketer.addTicket({
        discordId,
        sectionKey
      })

      const status = response.result === "success" ? 201 : 400
      res.status(status).send(response.payload)
    } catch (e) {
      next(e)
    }
  }
)

export default userRouter
