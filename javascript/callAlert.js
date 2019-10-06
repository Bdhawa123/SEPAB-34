export default class CallAlert {
  static noData() {
    const html = `<div class="alert alert-info" role="alert">
                    <p class="alert-primary-text">Database empty, please import data</p>
                  </div>`;
    document.querySelector('.alert-container').innerHTML = html;
  }

  static danger(error) {
    const html = `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                    <span class="alert-danger-text">Invalid csv file: ${error}</span>
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>`;
    document.querySelector('.alert-container').innerHTML = html;
  }

  static update() {
    const html = `<div class="alert alert-primary" role="alert">
                    <h4>Update: Snap noisy GPS to road</h4>
                    <hr>
                    <p class="alert-primary-text">Drag the sliders to select the range of GPS points to snap to road</p>
                  </div>`;
    document.querySelector('.alert-container').innerHTML = html;
  }

  static destroy() {
    document.querySelector('.alert-container').innerHTML = '';
  }
}
