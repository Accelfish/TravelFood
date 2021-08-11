class TravelFood {
  constructor() {
    this.pageObject = {
      currentPage: 0, //目前頁碼
      totalPage: 0, //總頁數
      pageSize: 10, //每頁呈現的資料列
      travelFood: [], //呈現的資料來源(原始資料)
    };
    this.init();
  }

  init() {
    this.loading = document.querySelector('#Loading');
    this.travelFoodList = document.querySelector('#TfBody');
    this.pagination = document.querySelector('#Pagination');
    this.callTravelFoodData();
  }

  /**
   * 取得總頁數
   * @returns 總頁數
   */
  getTotalPage() {
    return this.pageObject.totalPage;
  }

  /**
   * 取得目前頁碼
   * @returns 目前的頁碼
   */
  getCurrentPage() {
    return this.pageObject.currentPage;
  }

  /**
   * 取得每頁的資料數
   * @returns 每頁的資料筆數
   */
  getPageSize() {
    return this.pageObject.pageSize;
  }

  /**
   * 取得已儲存的小吃資料
   * @returns 已儲存的小吃資料
   */
  getTravelFoodData() {
    return this.pageObject.travelFood;
  }

  /**
   * 設定目前頁碼與列表
   * @param {number} targetPage
   */
  setCurrentPage(targetPage) {
    this.pageObject.currentPage = targetPage;
    this.renderTable();
  }

  /**
   * 設定總頁數
   * @param {number}} value
   */
  setTotalPage(value) {
    this.pageObject.totalPage = value;
  }

  /**
   * 設定全部資料
   * @param {object} value
   */
  setTravelFood(value) {
    this.pageObject.travelFood = value;
  }

  /**
   * 設定按下頁碼的事件
   */
  setPageItemEvent() {
    let vm = this;
    const pageItemDOM = vm.pageItems;
    for (let element of pageItemDOM) {
      element.addEventListener('click', function () {
        document
          .getElementsByClassName('js-tf__pageItem')[0]
          .classList.remove('js-tf__pageItem');
        this.classList.add('js-tf__pageItem');
        let pageNumber = parseInt(element.dataset.pageNumber);
        if (pageNumber) {
          vm.setCurrentPage(pageNumber);
        }
      });
    }
  }

  /**
   * 渲染頁碼
   */
  renderPagination() {
    let vm = this;
    let totalPage = this.getTotalPage();
    let template = '';
    let i = 0;
    while (i < totalPage) {
      i += 1;
      if (i === 1) {
        template += `<li class='text-center tf__pageItem js-tf__pageItem' data-page-number='${i}'>${i}</li>`;
        continue;
      } 
      template += `<li class='text-center tf__pageItem' data-page-number='${i}'>${i}</li>`;
    }
    vm.pagination.innerHTML = template;
    vm.pageItems = document.getElementsByClassName('tf__pageItem');
  }

  /**
   * 渲染表格
   */
  renderTable() {
    let vm = this;
    let tableTemplate = '';
    let travelFoodData = vm.getTravelFoodData();
    let currentPage = vm.getCurrentPage() - 1;
    let pageSize = vm.getPageSize();
    let currentData = travelFoodData[currentPage];
    let previewImageAlignBottomIndex = pageSize - 2; //預覽圖片最後兩張空間靠下

    currentData.forEach((foodData, index) => {
      let currentDataIndex = currentPage * pageSize + index + 1; //目前資料在總資料的index

      if (index % 2) {
        tableTemplate += `<tr class='tf__row'>`;
      } else {
        tableTemplate += `<tr class='tf__row tf__row-even'>`;
      }

      tableTemplate += `<td class='tf__td text-secondary text-center' title='${currentDataIndex}'>${currentDataIndex}</td>
						<td class='tf__td text-center' title='${foodData.City}'>${foodData.City}</td>
						<td class='tf__td' title='${foodData.Name}'>
							<div class='inner__image'>
								<img class='tf__image' src='${foodData.PicURL}' loading='lazy' width='80' height='50' alt='${foodData.Name}'>
								<div class='inner__preview 
                ${index >= previewImageAlignBottomIndex
                    ? 'inner__preview-bottom'
                    : ''}'>
									<img class='tf__previmage' src='${foodData.PicURL}' width='280' height='190' alt='${foodData.Name}'>
								</div>
							</div>
						</td>
						<td class='tf__td tf__td-name' title='${foodData.Name}'>
							${foodData.Url
                  ? `<a class='text__link' href=${foodData.Url} target='_blank' title='${foodData.Name}'>${foodData.Name}</a>`
                  : foodData.Name}
						</td>
						<td class='tf__td' title='${foodData.HostWords}'>
							${
                foodData.HostWords.length < 50
                  ? foodData.HostWords
                  : foodData.HostWords.slice(0, 50) + '...'
              }
				</td>
			</tr>`;
    });

    vm.travelFoodList.innerHTML = tableTemplate;
  }

  /**
   * 呼叫API取資料
   */
  callTravelFoodData() {
    let vm = this;
    vm.loading.classList.remove('js-hidden');
    fetch('https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx')
      .then((response) => response.json())
      .then((foodData) => {
        let len = foodData.length;
        let pageSize = vm.getPageSize();
        vm.setTotalPage(Math.ceil(len / pageSize));
        //整理資料為二維陣列
        let sortData = [];
        let index = 0;
        while (index <= len) {
          sortData.push(foodData.splice(0, pageSize));
          index += pageSize;
        }
        vm.setTravelFood(sortData);
        vm.renderPagination();
        vm.setPageItemEvent();
        vm.setCurrentPage(1); //取完資料設定第一頁
        document.getElementById('Pagination').classList.remove('js-hidden');
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        vm.loading.classList.add('js-hidden');
      });
  }
}

const travelFood = new TravelFood();