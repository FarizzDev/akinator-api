import { region, regions } from "./constants/Config"
import { requestAki as request, setupAki } from "./functions/Request"
import { AkinatorAnswer, AkinatorAPIAnswerResponse, AkinatorAPICancelAnswerResponse, AkinatorConstructor } from "./types/Aki"

export class Akinator {
  step: number = 0
  region: region
  progress: number = 0.0
  question: string = ""
  isWin: boolean = false
  sugestion_name: string = ""
  sugestion_desc: string = ""
  sugestion_photo: string = ""

  private session: string = ""
  private signature: string = ""
  private baseUrl: string = ""
  private sid: number = 0
  private childMode: boolean
  private step_last?: number
  private config: any = {}

  constructor({ region = "en", childMode = false, config = {} }: AkinatorConstructor) {
    if (!regions.includes(region)) {
      throw new Error("Please insert a correct region!")
    }

    this.region = region
    this.childMode = childMode
    this.config = config
  }

  async start(): Promise<void> {
    const { session, signature, question, baseUrl, sid } = await setupAki(this.region, this.childMode, this.config)

    if (!session || !signature || !question) {
      throw new Error("Failed to get session and signature")
    }

    this.session = session
    this.signature = signature
    this.baseUrl = baseUrl
    this.sid = sid
    this.question = question
  }

  async answer(answ: AkinatorAnswer): Promise<void> {
    const response = await request<AkinatorAPIAnswerResponse>(
      `${this.baseUrl}/answer`,
      {
        step: this.step,
        progression: this.progress,
        sid: this.sid,
        cm: this.childMode,
        answer: answ,
        step_last_proposition: this.step_last ?? "",
        session: this.session,
        signature: this.signature
      },
      this.config
    )

    if (response.completion !== "OK") {
      throw new Error("Failed making request, completion: " + response.completion)
    }

    if (response.id_proposition) {
      this.sugestion_name = response.name_proposition
      this.sugestion_desc = response.description_proposition
      this.sugestion_photo = response.photo
      this.isWin = true
    } else {
      this.step = parseInt(response.step)
      this.progress = parseFloat(response.progression)
      this.question = response.question
    }
  }

  async cancelAnswer(): Promise<void> {
    const response = await request<AkinatorAPICancelAnswerResponse>(
      `${this.baseUrl}/cancel_answer`,
      {
        step: this.step,
        progression: this.progress,
        sid: this.sid,
        cm: this.childMode,
        session: this.session,
        signature: this.signature
      },
      this.config
    )

    this.step = parseInt(response.step)
    this.progress = parseFloat(response.progression)
    this.question = response.question
  }
}
