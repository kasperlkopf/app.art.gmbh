// SkeletonCard.js

const template = `
  <div class="card mb-3 skeleton-card placeholder-glow shadow-sm" style="border-left: 4px solid #adb5bd !important">
    <div class="card-header bg-white border-bottom-0">
      <div class="row flex-md-nowrap">
        <div class="col-auto me-2 lh-sm" style="width: 110px">
          <p class="mb-0"><span class="placeholder rounded opacity-25" style="width: 80px"></span></p>
          <small class="text-muted"><span class="placeholder rounded opacity-25" style="width: 70px"></span></small>
        </div>
        <div class="col lh-sm">
          <p class="mb-0"><span class="placeholder rounded opacity-25" style="width: 180px"></span></p>
          <small class="text-muted"><span class="placeholder rounded opacity-25" style="width: 60px"></span></small>
        </div>
        <div class="col-auto d-flex flex-nowrap ms-2">
          <div class="btn placeholder opacity-25 me-2" style="width: 42px; height: 38px"></div>
          <div class="btn placeholder opacity-25" style="width: 42px; height: 38px"></div>
        </div>
      </div>
    </div>
    <div class="card-body border-top bg-white">
      <div class="row flex-md-nowrap">
        <div class="col-auto" style="width: 110px">
          <p class="mb-0 lh-sm"><span class="placeholder rounded opacity-25" style="width: 80px"></span></p>
        </div>
        <div class="col">
          <p class="mb-0 lh-sm"><span class="placeholder rounded opacity-25" style="width: 280px"></span></p>
          <small class="text-muted"><span class="placeholder rounded opacity-25" style="width: 220px"></span></small>
        </div>
      </div>
    </div>
  </div>
`;

export default {
  name: 'SkeletonCard',
  template,
};
