import { load } from "cheerio"
import { request } from "undici"

import { region, themes } from "../constants/Config"
import { ResponseSetupAki } from "../types/Aki"

const defaultHeaders = {
  "content-type": "application/x-www-form-urlencoded",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  "x-requested-with": "XMLHttpRequest"
}

const defaultConfig = {
  throwOnError: false,
  headersTimeout: 30000,
  bodyTimeout: 30000
}

export const setupAki = async (region: region, childMode: boolean, config: any = {}): Promise<ResponseSetupAki> => {
  try {
    const [lang, theme] = region.split("_")
    const baseUrl = `https://${lang}.akinator.com`
    const sid = themes[theme] ?? 1

    const body = new URLSearchParams(
      Object.entries({
        cm: childMode === true,
        sid
      })
    ).toString()

    const { body: responseBody } = await request(`${baseUrl}/game`, {
      method: "POST",
      headers: {
        ...defaultHeaders,
        ...config.headers
      },
      body,
      ...defaultConfig,
      ...config
    })

    const data = await responseBody.text()
    const $ = load(data)
    const session = $("#askSoundlike > #session").attr("value")
    const signature = $("#askSoundlike > #signature").attr("value")
    const question = $("#question-label").text()

    return { session, signature, question, baseUrl, sid }
  } catch (e) {
    console.log(e)
    throw e
  }
}

export const requestAki = async <T>(url: string, body: any, config: any = {}): Promise<T> => {
  const { body: responseBody } = await request(url, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...config.headers
    },
    body: new URLSearchParams(Object.entries(body)).toString(),
    ...defaultConfig,
    ...config
  })

  const data = await responseBody.text()

  try {
    return JSON.parse(data) as T
  } catch {
    return data as unknown as T
  }
}
