<script>
	import '../app.css';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import posthog from 'posthog-js';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

	  function closeDrawer() {
    document.getElementById('main-drawer').checked = false;
  }

</script>

<div class="min-h-screen flex flex-col">
<div class="drawer">
  <input id="main-drawer" type="checkbox" class="drawer-toggle" />

  <!-- Main content -->
  <div class="drawer-content flex flex-col">

    <!-- NAVBAR -->
    <div class="navbar bg-base-200 px-6 w-full">

      <!-- Mobile hamburger -->
      <div class="flex-none lg:hidden">
        <label for="main-drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-6 w-6 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>

      <!-- Brand -->
      <div class="flex-1 text-xl font-bold">
        <a href="/">💊 Bhutan Infectious Disease Guidelines</a>
      </div>

      <!-- Desktop horizontal menu -->
      <div class="hidden lg:flex gap-6">
        <a href="/" class="link">Home</a>
        <a href="/treatments" class="link">Treatment Recommendations</a>
        <a href="/about" class="link">About</a>
        <a href="https://forms.gle/Ks47wkzBgDkZpwcVA" class="link">
          <div class="btn btn-xs btn-primary">Feedback Form</div>
        </a>
      </div>
    </div>

	<div class="flex-1">
		<slot />
	</div>

  </div>

  <!-- DRAWER SIDEBAR (mobile menu) -->
  <div class="drawer-side">
    <label for="main-drawer" aria-label="close sidebar" class="drawer-overlay"></label>

    <ul class="menu bg-base-200 min-h-full w-80 p-4 space-y-2">
      <li><a href="/" onclick={closeDrawer}>Home</a></li>
      <li><a href="/treatments" onclick={closeDrawer}>Treatment Recommendations</a></li>
      <li><a href="/about" onclick={closeDrawer}>About</a></li>
      <li>
        <a href="https://forms.gle/Ks47wkzBgDkZpwcVA">
          <div class="btn btn-primary btn-sm w-full">Feedback Form</div>
        </a>
      </li>
    </ul>
  </div>
</div>


	<!-- Main content expands -->


	<!-- Footer pushed to bottom -->
	<div class="footer footer-center bg-base-200 p-2 mt-auto">
		<div>
			<span>
				<div class="flex items-center justify-center gap-2 px-3 rounded-full bg-warning text-warning-content font-bold shadow">
				<span class="text-lg">⚠️</span>
				Pilot: This site is currently in pilot phase for feedback and improvements.
				</div>
			</span>
			
		</div>
	</div>

</div>
