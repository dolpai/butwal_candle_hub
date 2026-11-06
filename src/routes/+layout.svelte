<script lang="ts">
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import Toast from '$lib/components/Toast.svelte';
  import type { PageData } from './$types';

  let { data, children }: { data: PageData; children: any } = $props();

  let isAdminPage = $derived(data && 'isAdminPage' in data ? data.isAdminPage : false);
</script>

{#if isAdminPage}
  <div class="min-h-screen">
    {@render children()}
  </div>
{:else}
  <div class="min-h-screen flex flex-col">
    <Header categories={data.categories} storeSettings={data.storeSettings} session={data.session} />
    <main class="flex-1">
      {@render children()}
    </main>
    <Footer categories={data.categories} storeSettings={data.storeSettings} />
  </div>
  <Toast />
{/if}
