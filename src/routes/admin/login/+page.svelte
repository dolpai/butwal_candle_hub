<script lang="ts">
  import type { ActionData } from './$types';
  import { BUSINESS } from '$lib/config';
  import { Lock, Mail, Eye, EyeOff } from 'lucide-svelte';

  let { form }: { form: ActionData } = $props();

  let showPassword = $state(false);
</script>

<svelte:head>
  <title>Admin Login — Butwal Candle Hub</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-cream px-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <h1 class="font-serif text-2xl font-bold text-brown">Butwal Candle Hub</h1>
      <p class="text-sm text-gold tracking-widest uppercase mt-1">Admin Dashboard</p>
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-beige-dark/30 p-6 sm:p-8">
      <div class="flex items-center justify-center mb-6">
        <div class="w-14 h-14 bg-brown rounded-full flex items-center justify-center">
          <Lock class="w-7 h-7 text-cream" />
        </div>
      </div>

      <h2 class="font-serif text-xl font-bold text-brown text-center mb-1">Welcome Back</h2>
      <p class="text-sm text-brown-light text-center mb-6">Sign in to manage your store</p>

      {#if form?.error}
        <div class="bg-danger/10 border border-danger/30 rounded-lg p-3 text-danger text-sm mb-4">
          {form.error}
        </div>
      {/if}

      <form method="POST" action="?/login" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-brown mb-1">Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-light/50" />
            <input
              id="email"
              name="email"
              type="email"
              class="input-field pl-10"
              placeholder="admin@example.com"
              required
            />
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-brown mb-1">Password</label>
          <div class="relative">
            <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-brown-light/50" />
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              class="input-field pl-10 pr-10"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onclick={() => (showPassword = !showPassword)}
              class="absolute right-3 top-1/2 -translate-y-1/2 text-brown-light/50 hover:text-brown"
              aria-label="Toggle password visibility"
            >
              {#if showPassword}
                <EyeOff class="w-5 h-5" />
              {:else}
                <Eye class="w-5 h-5" />
              {/if}
            </button>
          </div>
        </div>

        <button type="submit" class="btn-primary w-full">
          Sign In
        </button>
      </form>

      <p class="text-xs text-brown-light/60 text-center mt-6">
        Authorized personnel only. Contact the store administrator for access.
      </p>
    </div>

    <div class="text-center mt-4">
      <a href="/" class="text-sm text-gold hover:text-gold-dark transition-colors">← Back to Store</a>
    </div>
  </div>
</div>
