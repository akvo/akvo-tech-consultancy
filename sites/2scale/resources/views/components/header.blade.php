<nav class="navbar navbar-expand-lg fixed-top navbar-dark blue-gradient">
  <img class="navbar-brand" src="{{ asset('/images/2scale_logo_white.png') }}"/>
  <button class="navbar-toggler p-0 border-0" type="button" data-toggle="offcanvas">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="navbar-collapse offcanvas-collapse">
    <ul class="navbar-nav ml-auto">
      <li class="nav-item {{Route::is('home') ? 'active' : ''}}">
        <a class="nav-link" href="/">Home</a>
      </li>
      <li class="nav-item {{Route::is('dashboard') ? 'active' : '' }}">
        <a class="nav-link" href="/dashboard">Impact</a>
      </li>
      <li class="nav-item {{Route::is('partnership') ? 'active' : '' }}">
        <a class="nav-link" href="/partnership">Partnership</a>
      </li>
      <li class="nav-item {{Route::is('reachreact') ? 'active' : '' }}">
        <a class="nav-link" href="/reach-and-react">Reach and Reaction</a>
      </li>
      <li class="nav-item {{Route::is('database') ? 'active' : '' }}">
        <a class="nav-link" href="/database">Database</a>
      </li>
      <li class="nav-item {{Route::is('organisation') ? 'active' : '' }}">
        <a class="nav-link" href="/organisation">Organisation</a>
      </li>
      <li class="nav-item {{Route::is('survey') ? 'active' : '' }}">
        <a class="nav-link" href="/survey">Survey</a>
      </li>
    </ul>
  </div>
</nav>
