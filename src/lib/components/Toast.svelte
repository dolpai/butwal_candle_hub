<script lang="ts">
  import { toasts } from '$lib/toast.svelte';
  import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-svelte';

  const icons = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
    warning: AlertCircle
  };

  const colors = {
    success: 'text-success border-success/30',
    error: 'text-danger border-danger/30',
    info: 'text-brown border-brown/30',
    warning: 'text-warning border-warning/30'
  };
</script>

{#if $toasts.length > 0}
  <div class="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
    {#each $toasts as toast (toast.id)}
      {@const Icon = icons[toast.type]}
      <div
        class="flex items-start gap-3 bg-white rounded-lg shadow-lg border {colors[toast.type]} p-4 animate-slide-up"
      >
        <Icon class="w-5 h-5 shrink-0 mt-0.5" />
        <p class="text-sm text-brown flex-1">{toast.message}</p>
        <button onclick={() => toasts.dismiss(toast.id)} class="text-brown-light hover:text-brown">
          <X class="w-4 h-4" />
        </button>
      </div>
    {/each}
  </div>
{/if}
