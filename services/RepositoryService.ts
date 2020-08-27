import { Octokit } from "@octokit/rest";

export interface Repository {
  name: string
  full_name: string
  private: boolean
  permissions: {
    admin: boolean
  }
  owner:{
    login: string
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $_repos(): RepositoryService
  }
}

declare module '@nuxt/types' {
  interface NuxtAppOptions {
    $_repos(): RepositoryService
  }
}

declare module 'vuex/types/index' {
  interface Store<S> {
    $_repos(): RepositoryService
  }
}

export default ( ctx:any, inject:any) => {
  inject("_repos", ():RepositoryService=>{
    return new RepositoryService(
      process.env.GH_TOKEN as string
    )
  })
}

export class RepositoryService {

  constructor(
    protected token: string
  ) {
  }

  client():Octokit{
    return new Octokit({
      auth: this.token
    })
  }

  async load(){
    const result = await this.client().repos.listForAuthenticatedUser({
      sort:"updated"
    })
    const data = result.data as Repository[]
    return data.filter(r=> (!r.private) && (r.permissions.admin))
  }

  async add(name:string){
    await this.client().repos.createForAuthenticatedUser({name})
  }
  async rm(repo:Repository){
    await this.client().repos.delete({
      owner: repo.owner.login,
      repo: repo.name
    })
  }

}
