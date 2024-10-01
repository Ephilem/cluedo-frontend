<script>
    import { browser } from '$app/environment'
    import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query'
    import { navigating } from '$app/stores';

    import "../app.css";
    import "../crt.css";
    import "../app_shad.css";
    import {addAPIProvider} from "@iconify/svelte";

    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                enabled: browser,
            },
        },
    })

    addAPIProvider('local', {
        resources: ['http://localhost:3005']
    })

    let isChangingPage = false;

    $: {
        if ($navigating) {
            isChangingPage = true;
        } else {
            setTimeout(() => {
                isChangingPage = false;
            }, 50);
        }
    }
</script>

<QueryClientProvider client={queryClient}>
    <div class="crt-screen" class:page-transition={isChangingPage}>
        <slot />
    </div>
</QueryClientProvider>
