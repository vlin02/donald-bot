import express, {Request, Response} from "express"
import "dotenv/config"
import { logger } from "./logger"
import apiRouter from "../routes"

const app = express()

app.enable("trust proxy")

app.use(express.json())

app.use("/api", apiRouter)

app.use((err: any, _: Request, res: Response) => {
  logger.error("unknown exception thrown: %s", err)

  res.status(500).json({
    errors: {
      message: err.message
    }
  })
})

export default app
