<script lang="ts">
  import { page } from '$app/stores';
  import { ArrowLeft } from 'lucide-svelte';

  let status = $derived($page.status);
  let message = $derived($page.error?.message || 'Something went wrong');
</script>

<div class="min-h-screen flex items-center justify-center bg-cream px-4">
  <div class="text-center max-w-md">
    <h1 class="font-serif text-6xl font-bold text-gold mb-4">{status}</h1>
    <p class="text-brown-light text-lg mb-6">{message}</p>
    <a href="/" class="btn-primary inline-flex items-center gap-2">
      <ArrowLeft class="w-4 h-4" />
      Back to Home
    </a>
  </div>
</div>
