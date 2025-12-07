<script>
	import '../app.css';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import posthog from 'posthog-js';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}
</script>

<div class="flex min-h-screen flex-col">
	<div class="navbar bg-base-200 px-6">
		<div class="flex-1 text-xl font-bold">
			<a href="/">💊 Bhutan Infectious Disease Guidelines</a>
		</div>
		<div class="flex gap-6">
			<a href="/" class="link">Home</a>
			<a href="/treatments" class="link">Treatment Recommendations</a>
			<a href="/about" class="link">About</a>
			<a href="https://forms.gle/Ks47wkzBgDkZpwcVA" class="link"
				><div class="btn btn-xs btn-primary">Feedback Form</div></a
			>
		</div>
	</div>

	<!-- Main content expands -->
	<div class="flex-1">
		<slot />
	</div>

	<!-- Footer pushed to bottom -->
	<div class="footer-center mt-auto footer bg-base-200 p-2">
		<div>
			<span>
				<div
					class="flex items-center justify-center gap-2 rounded-full bg-warning px-3 font-bold text-warning-content shadow"
				>
					<span class="text-lg">⚠️</span>
					Pilot: This site is currently in pilot phase for feedback and improvements.
				</div>
			</span>
		</div>
	</div>
</div>
