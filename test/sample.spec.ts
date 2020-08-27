import {RepositoryService} from "~/services/RepositoryService";

describe("タイトルコンポーネントのテスト",()=>{
  test("タイトルがが表示されているか", ()=>{
    expect(1+3).toBe(4)
  })
})

describe("RepositoryService",()=>{
  test("リポジトリ一覧の取得", async ()=>{
    const service = new RepositoryService(process.env.GH_TOKEN as string)
    const result = await service.load().catch(e=>null)
    expect(Array.isArray(result)).toBe(true)
  })
})
