<template>
  <div>
    <a class="btn btn-light" @click.prevent="add">新規追加</a>
    <br><br>
    <ul class="list-group list-group-flush">
      <li class="list-group-item" v-for="repo in repos">
        <a class="btn btn-text" @click.prevent="rm(repo)">{{ repo.full_name }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
  import {RepositoryService,Repository} from "@/services/RepositoryService";

  import {defineComponent, onMounted, reactive, SetupContext} from '@nuxtjs/composition-api'

  export default defineComponent({
    setup(props:null,ctx: SetupContext) {
      const token = process.env.GH_TOKEN as string
      const repositoryService = ctx.root.$_repos();

      const repos = reactive<Repository[]>([])
      const load = async () => {
        const result = await repositoryService.load()
        repos.splice(0)
        for(let repo of result){
          repos.push(repo)
        }
      }
      const add = async () => {
        let name;
        if(name = prompt("Repo Name?")){
          await repositoryService.add(name)
          load()
        }
      }
      const rm = async (repo:Repository) => {
        if(confirm("Delete This Repo?")){
          await repositoryService.rm(repo)
          load()
        }
      }

      onMounted(()=>{
        load()
      })

      return {
        repos,
        load,
        add,
        rm
      }
    },
  })
</script>

<style>
</style>
