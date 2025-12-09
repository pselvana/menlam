<script>
	import '../app.css';
	import { browser } from '$app/environment';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import posthog from 'posthog-js';

	if (browser) {
		beforeNavigate(() => posthog.capture('$pageleave'));
		afterNavigate(() => posthog.capture('$pageview'));
	}

  // Close drawer when clicking menu items
  const closeDrawer = () => {
    const drawer = document.getElementById("main-drawer");
    if (drawer) drawer.checked = false;
  };
</script>
<div class="min-h-screen flex flex-col w-full overflow-x-hidden">

  <!-- MOBILE DRAWER (mobile only) -->
  <div class="drawer lg:hidden w-full overflow-x-hidden">
    <input id="main-drawer" type="checkbox" class="drawer-toggle" />

    <div class="drawer-content flex flex-col w-full overflow-x-hidden min-h-screen">

      <!-- NAVBAR -->
      <div class="navbar bg-base-200 px-4 sm:px-6 w-full">
        
        <!-- Mobile hamburger (only mobile) -->
        <div class="flex-none lg:hidden">
          <label for="main-drawer" class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" class="h-6 w-6 stroke-current">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </label>
        </div>

        <!-- Brand -->
        <div class="flex-1 text-xl font-bold">
          <a href="/">💊 Bhutan Infectious Disease Guidelines</a>
        </div>

        <!-- Desktop menu -->
        <div class="hidden lg:flex gap-6">
          <a href="/" class="link">Home</a>
          <a href="/treatments" class="link">Treatment Recommendations</a>
          <a href="/about" class="link">About</a>
          <a href="https://forms.gle/Ks47wkzBgDkZpwcVA" class="link">
            <div class="btn btn-xs btn-primary">Feedback Form</div>
          </a>
        </div>
      </div>

      <!-- PAGE CONTENT -->
      <div class="flex-grow w-full overflow-x-hidden">
        <slot />
      </div>

      <!-- FOOTER -->
      <div class="footer footer-center bg-base-200 p-2 mt-4 w-full">
        <div>
          <div class="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-warning text-warning-content font-bold shadow">
            <span class="text-lg">⚠️</span>
            Pilot: This site is currently in pilot phase for feedback and improvements.
          </div>
        </div>
      </div>

    </div>

    <!-- MOBILE SIDEBAR -->
    <div class="drawer-side">
      <label for="main-drawer" class="drawer-overlay"></label>
      <ul class="menu bg-base-200 min-h-full w-80 p-4 space-y-2">
        <li><a href="/" on:click={closeDrawer}>Home</a></li>
        <li><a href="/treatments" on:click={closeDrawer}>Treatment Recommendations</a></li>
        <li><a href="/about" on:click={closeDrawer}>About</a></li>
        <li>
          <a href="https://forms.gle/Ks47wkzBgDkZpwcVA">
            <div class="btn btn-primary btn-sm w-full">Feedback Form</div>
          </a>
        </li>
      </ul>
    </div>
  </div>

  <!-- DESKTOP CONTENT OUTSIDE OF DRAWER -->
  <div class="hidden lg:flex flex-col flex-grow">
    <!-- Navbar (no hamburger) -->
    <div class="navbar bg-base-200 px-4 sm:px-6 w-full">
      <div class="flex-1 text-xl font-bold">
        <a href="/">💊 Bhutan Infectious Disease Guidelines</a>
      </div>
      <div class="flex gap-6">
        <a href="/" class="link">Home</a>
        <a href="/treatments" class="link">Treatment Recommendations</a>
        <a href="/about" class="link">About</a>
        <a href="https://forms.gle/Ks47wkzBgDkZpwcVA" class="link">
          <div class="btn btn-xs btn-primary">Feedback Form</div>
        </a>
      </div>
    </div>

    <div class="flex-grow w-full overflow-x-hidden">
      <slot />
    </div>

    <div class="footer footer-center bg-base-200 p-2 mt-4 w-full">
      <div>
        <div class="flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-warning text-warning-content font-bold shadow">
          <span class="text-lg">⚠️</span>
          Pilot: This site is currently in pilot phase for feedback and improvements.
        </div>
      </div>
    </div>
  </div>

</div>
