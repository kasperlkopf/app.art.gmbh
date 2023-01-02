// Header.js

import ThemeSelect from '/components/ThemeSelect.js';

const template = `
  <header class="navbar navbar-expand-md sticky-top border-bottom bg-body top-0 bg-opacity-75" style="backdrop-filter: blur(12px);">
    <nav class="container-lg flex-wrap flex-lg-nowrap">

      <button class="navbar-toggler nav-link p-2 border-0 shadow-none" type="button" data-bs-toggle="offcanvas" data-bs-target="#sidebar">
        <i class="bi bi-list"></i>
      </button>

      <a class="navbar-brand py-2" href="#"> 
        <svg class="art-logo d-block" style="height: 32px;" viewBox="0 0 333 66" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g fill-rule="nonzero">
              <path d="M38.336,36.557 L65.174,36.557 L65.174,65.59 L0.189,65.59 L0.189,36.389 C0.189,16.64 16.224,0.605 35.973,0.605 L65.174,0.605 L65.174,29.469 L45.425,29.469 C41.543,29.468 38.336,32.675 38.336,36.557 Z" fill="#183264"></path>
              <path d="M72.769,0.605 L72.769,29.469 L99.945,29.469 C99.945,33.351 96.738,36.558 92.856,36.558 L72.77,36.558 L72.77,65.59 L101.971,65.59 C121.72,65.59 137.755,49.555 137.755,29.806 L137.755,0.605 L72.769,0.605 L72.769,0.605 Z" fill="#0068B2"></path>
              <g id="logo-text-elektromechanik" transform="translate(159.000000, 48.000000)" fill="#183264">
                <polygon points="0.25 0.582 10.483 0.582 10.483 1.719 1.528 1.719 1.528 8.376 9.156 8.376 9.156 9.513 1.528 9.513 1.528 16.311 10.483 16.311 10.483 17.448 0.25 17.448"></polygon>
                <path d="M14.049,14.487 L14.049,0.582 L15.257,0.582 L15.257,14.463 C15.257,15.766 15.66,16.382 17.011,16.382 L17.839,16.382 L17.839,17.448 L16.797,17.448 C14.925,17.448 14.049,16.287 14.049,14.487 Z"></path>
                <path d="M24.59,16.5 C25.941,16.5 26.77,16.097 27.74,15.126 L28.64,15.837 C27.479,16.997 26.413,17.59 24.518,17.59 C21.368,17.59 19.662,15.553 19.662,11.739 C19.662,8.044 21.368,5.889 24.234,5.889 C27.1,5.889 28.805,7.949 28.805,11.456 L28.805,12 L20.87,12 C20.871,14.913 22.15,16.5 24.59,16.5 Z M27.196,8.873 C26.699,7.665 25.562,6.954 24.235,6.954 C22.908,6.954 21.771,7.665 21.274,8.873 C21.013,9.607 20.942,9.915 20.871,11.029 L27.598,11.029 C27.527,9.939 27.503,9.56 27.196,8.873 Z"></path>
                <polygon points="36.48 11.17 33.875 14.179 33.875 17.448 32.667 17.448 32.667 0.582 33.875 0.582 33.875 12.473 39.536 6.03 41.076 6.03 37.309 10.293 41.904 17.447 40.412 17.447"></polygon>
                <path d="M45.505,14.463 L45.505,6.93 L43.942,6.93 L43.942,6.031 L45.505,6.031 L45.505,2.382 L46.713,2.382 L46.713,6.031 L49.295,6.031 L49.295,6.93 L46.713,6.93 L46.713,14.487 C46.713,15.695 47.257,16.382 48.466,16.382 L49.295,16.382 L49.295,17.448 L48.253,17.448 C46.452,17.448 45.505,16.192 45.505,14.463 Z"></path>
                <path d="M57.089,6.954 C55.123,6.954 54.034,8.588 54.034,10.412 L54.034,17.448 L52.826,17.448 L52.826,6.03 L54.034,6.03 L54.034,7.546 C54.697,6.48 56.023,5.888 57.374,5.888 C58.487,5.888 59.292,6.149 60.121,6.978 L59.245,7.854 C58.557,7.167 58.036,6.954 57.089,6.954 Z"></path>
                <path d="M68.979,16.335 C68.15,17.163 67.108,17.59 65.805,17.59 C64.527,17.59 63.461,17.163 62.632,16.335 C61.424,15.127 61.21,13.373 61.21,11.739 C61.21,10.105 61.424,8.352 62.632,7.144 C63.461,6.315 64.527,5.889 65.805,5.889 C67.108,5.889 68.15,6.315 68.979,7.144 C70.187,8.352 70.401,10.105 70.401,11.739 C70.401,13.373 70.187,15.126 68.979,16.335 Z M68.174,7.925 C67.534,7.285 66.729,6.953 65.805,6.953 C64.882,6.953 64.076,7.285 63.437,7.925 C62.489,8.873 62.418,10.412 62.418,11.738 C62.418,13.064 62.489,14.605 63.437,15.552 C64.077,16.192 64.882,16.524 65.805,16.524 C66.729,16.524 67.535,16.192 68.174,15.552 C69.121,14.604 69.193,13.064 69.193,11.738 C69.193,10.412 69.121,8.873 68.174,7.925 Z"></path>
                <path d="M89.39,10.365 C89.39,8.162 88.3,6.954 86.24,6.954 C84.25,6.954 83.018,8.186 83.018,10.152 L83.018,17.447 L81.811,17.447 L81.811,10.364 C81.811,8.161 80.721,6.953 78.661,6.953 C76.6,6.953 75.439,8.185 75.439,10.364 L75.439,17.447 L74.232,17.447 L74.232,6.03 L75.439,6.03 L75.439,7.38 C76.292,6.385 77.429,5.888 78.827,5.888 C80.533,5.888 81.812,6.622 82.499,7.973 C83.351,6.622 84.678,5.888 86.383,5.888 C87.638,5.888 88.657,6.291 89.392,6.978 C90.173,7.736 90.576,8.802 90.576,10.152 L90.576,17.447 L89.392,17.447 L89.392,10.365 L89.39,10.365 Z"></path>
                <path d="M99.219,16.5 C100.57,16.5 101.399,16.097 102.369,15.126 L103.269,15.837 C102.108,16.997 101.042,17.59 99.147,17.59 C95.997,17.59 94.291,15.553 94.291,11.739 C94.291,8.044 95.997,5.889 98.863,5.889 C101.729,5.889 103.434,7.949 103.434,11.456 L103.434,12 L95.5,12 C95.5,14.913 96.779,16.5 99.219,16.5 Z M101.825,8.873 C101.328,7.665 100.191,6.954 98.864,6.954 C97.538,6.954 96.4,7.665 95.903,8.873 C95.642,9.607 95.571,9.915 95.5,11.029 L102.227,11.029 C102.157,9.939 102.133,9.56 101.825,8.873 Z"></path>
                <path d="M111.719,17.59 C108.592,17.59 106.697,15.363 106.697,11.739 C106.697,8.115 108.592,5.889 111.719,5.889 C113.282,5.889 114.277,6.292 115.485,7.642 L114.656,8.4 C113.684,7.31 112.926,6.955 111.719,6.955 C110.416,6.955 109.374,7.452 108.687,8.471 C108.119,9.3 107.905,10.201 107.905,11.74 C107.905,13.28 108.119,14.18 108.687,15.01 C109.374,16.028 110.416,16.526 111.719,16.526 C112.926,16.526 113.684,16.147 114.656,15.081 L115.485,15.839 C114.277,17.187 113.282,17.59 111.719,17.59 Z"></path>
                <path d="M126.689,10.365 C126.689,8.162 125.599,6.954 123.538,6.954 C121.478,6.954 120.317,8.186 120.317,10.365 L120.317,17.448 L119.109,17.448 L119.109,0.582 L120.317,0.582 L120.317,7.38 C121.169,6.385 122.282,5.888 123.68,5.888 C126.31,5.888 127.897,7.499 127.897,10.152 L127.897,17.447 L126.689,17.447 L126.689,10.365 L126.689,10.365 Z"></path>
                <path d="M138.949,16.311 C137.978,17.283 137.078,17.59 135.468,17.59 C133.763,17.59 132.838,17.305 132.104,16.547 C131.56,16.003 131.275,15.173 131.275,14.321 C131.275,12.236 132.767,11.028 135.254,11.028 L138.949,11.028 L138.949,9.749 C138.949,7.925 138.073,6.954 135.728,6.954 C134.117,6.954 133.312,7.357 132.577,8.399 L131.701,7.641 C132.672,6.291 133.857,5.888 135.729,5.888 C138.761,5.888 140.158,7.239 140.158,9.631 L140.158,17.448 L138.95,17.448 L138.95,16.311 L138.949,16.311 Z M135.397,11.999 C133.455,11.999 132.483,12.757 132.483,14.297 C132.483,15.813 133.383,16.524 135.468,16.524 C136.51,16.524 137.481,16.429 138.311,15.647 C138.737,15.245 138.95,14.51 138.95,13.468 L138.95,11.999 L135.397,11.999 Z"></path>
                <path d="M152.499,10.365 C152.499,8.162 151.409,6.954 149.348,6.954 C147.288,6.954 146.127,8.186 146.127,10.365 L146.127,17.448 L144.919,17.448 L144.919,6.03 L146.127,6.03 L146.127,7.38 C146.979,6.385 148.092,5.888 149.49,5.888 C150.745,5.888 151.764,6.243 152.522,6.978 C153.304,7.736 153.707,8.802 153.707,10.152 L153.707,17.447 L152.499,17.447 L152.499,10.365 L152.499,10.365 Z"></path>
                <path d="M157.922,0.582 L159.414,0.582 L159.414,2.074 L157.922,2.074 L157.922,0.582 Z M158.065,6.03 L159.273,6.03 L159.273,17.447 L158.065,17.447 L158.065,6.03 Z"></path>
                <polygon points="167.681 11.17 165.075 14.179 165.075 17.448 163.868 17.448 163.868 0.582 165.075 0.582 165.075 12.473 170.737 6.03 172.276 6.03 168.51 10.293 173.105 17.447 171.613 17.447"></polygon>
              </g>
              <g id="logo-text-art" transform="translate(159.000000, 0.000000)" fill="#183264">
                <path d="M17.746,23.729 L21.628,12.926 L25.341,23.729 L17.746,23.729 Z M15.72,0.942 L0.191,37.57 L12.682,37.57 L14.539,32.337 L28.38,32.337 L30.237,37.57 L43.234,37.57 L28.38,0.942 L15.72,0.942 Z"></path>
                <path d="M74.629,17.822 C73.954,18.666 72.941,19.004 71.591,19.004 L66.021,19.004 L66.021,10.227 L71.591,10.227 C72.941,10.227 73.954,10.565 74.629,11.409 C75.304,12.084 75.642,13.266 75.642,14.616 C75.642,15.965 75.304,16.978 74.629,17.822 M85.77,21.029 C86.783,19.003 87.289,16.809 87.289,14.108 C87.289,9.888 85.939,6.681 83.238,4.318 C80.537,1.955 76.655,0.942 71.591,0.942 L53.868,0.942 L53.868,37.57 L66.021,37.57 L66.021,28.118 L70.578,28.118 L74.967,37.57 L88.639,37.57 L81.381,25.586 C83.238,24.573 84.757,23.054 85.77,21.029"></path>
                <polygon points="127.293 0.942 94.378 0.942 94.378 10.395 104.675 10.395 104.675 37.57 116.828 37.57 116.828 10.395 127.293 10.395"></polygon>
                <circle cx="44.757" cy="21.713" r="3.554"></circle>
                <circle cx="94.926" cy="21.713" r="3.554"></circle>
              </g>
            </g>
          </g>
        </svg>
      </a>

      <div class="d-flex">
        <!-- slack -->
        <div class="nav-item dropdown me-3">
          <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown" data-bs-display="static">
            <i class="bi bi-slack me-1"></i>
            <span class="d-none ms-2">Toggle theme</span>
          </a>
          <ul class="dropdown-menu dropdown-menu-end p-1">
            <li><h6 class="dropdown-header">Öffne Slack...</h6></li>
            <li>
              <a class="dropdown-item rounded mb-1" href="slack://channel?team=T69NHRRFB&id=C69K0LZAL">#art</a>
            </li>
            <li>
              <a class="dropdown-item rounded" href="slack://user?team=T69NHRRFB&id=U6HM3CR6C">@manuel</a>
            </li>
          </ul>
        </div>

        <ThemeSelect class="nav-item d-none d-md-block ms-2" />
      </div>

    </nav>
  </header>
`;

export default {
  name: 'Header',
  components: {
    ThemeSelect,
  },
  data() {
    return {
      //
    };
  },
  created() {
    console.log('Header: created');
  },
  template,
};
