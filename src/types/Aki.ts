import { region } from "../constants/Config"

export interface AkinatorConstructor {
  region?: region
  childMode?: boolean
  config?: any
}

export interface ResponseSetupAki {
  session: string
  signature: string
  question: string
  baseUrl: string
  sid: number
}

export enum AkinatorAnswer {
  "Yes",
  "No",
  "Don't know",
  "Probably",
  "Probably not"
}

export interface AkinatorAPIAnswerResponse {
  completion: "OK" | "KO" | "SOUNDLIKE"
  akitude: string
  step: string
  progression: string
  question_id: string
  question: string
  id_proposition: string
  id_base_proposition: string
  valide_contrainte: string
  name_proposition: string
  description_proposition: string
  flag_photo: string
  photo: string
  pseudo: string
  nb_elements: number
}

export interface AkinatorAPICancelAnswerResponse {
  akitude: string
  step: string
  progression: string
  question_id: string
  question: string
}
