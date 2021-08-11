class TravelFood {
  constructor() {
    this.pageObject = {
      currentPage: 0, //目前頁碼
      totalPage: 0, //總頁數
      pageSize: 10, //每頁呈現的資料列
      travelFood: [], //原始資料
      showFood:[], //呈現的資料
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
   * 取得已整理的小吃資料
   * @returns 已儲存的小吃資料
   */
  getSortFoodData() {
    return this.pageObject.showFood;
  }

  /**
   * 取得已整理的小吃資料
   * @returns 已儲存的小吃資料
   */
  setSortFoodData(value) {
    this.pageObject.showFood = value;
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
    const pageItemDOM = [...vm.pageItems];
    const paginationDOM = vm.pagination;
    pageItemDOM.forEach(element => {
      element.addEventListener('click', function(){
        let currentPageNumber = vm.getCurrentPage();
        let targetPageNumber = parseInt(this.dataset.pageNumber, 10);
        if (targetPageNumber) {
          if(targetPageNumber !== currentPageNumber){
            paginationDOM
              .getElementsByClassName('js-tf__pageItem')[0]
              .classList.remove('js-tf__pageItem');
            this.classList.add('js-tf__pageItem');
            vm.setCurrentPage(targetPageNumber);
          }
        }
      });
    });
    
    // const paginationDOM = vm.pagination;
    // paginationDOM.addEventListener((e)=>{
    //   //....
    // })
  }

  /**
   * 渲染頁碼
   */
  renderPagination() {
    let vm = this;
    let template = '';
    let len = vm.getTravelFoodData().length;
    let pageSize = vm.getPageSize();
    vm.setTotalPage(Math.ceil(len / pageSize));
    
    let totalPage = vm.getTotalPage();

    for (let i = 1; i <= totalPage; i += 1) {
      if (i === 1) {
        template += `<li class='text-center tf__pageItem js-tf__pageItem' data-page-number='${i}'>${i}</li>`;
      } else {
        template += `<li class='text-center tf__pageItem' data-page-number='${i}'>${i}</li>`;
      }
    }

    vm.pagination.innerHTML = template;
    vm.pageItems = vm.pagination.querySelectorAll('.tf__pageItem');

    vm.setPageItemEvent();
  }

  /**
   * 整理資料為二維陣列
   */
  sortData() {
    let vm =this;
    let pageSize = vm.getPageSize();
    let travelFoodData = vm.getTravelFoodData();
    let count = 0;
    let tmpArr = [];
    let sortArr = [];

    travelFoodData.forEach((foodData, index) => {
      count += 1;
      tmpArr.push(foodData);
      if (count % pageSize == 0) {
        sortArr.push(tmpArr);
        tmpArr = [];
      }
      //不滿pageSize的資料
      if (count % pageSize != 0 &&  index === travelFoodData.length -1) {
        sortArr.push(tmpArr);
      }
    });

    vm.setSortFoodData(sortArr);
    return sortArr;
  };

  /**
   * 渲染表格
   */
  renderTable() {
    let vm = this;
    let tableTemplate = '';
    let descLimitLength = 50;
    let currentPage = vm.getCurrentPage() - 1;
    let pageSize = vm.getPageSize();
    let previewImageAlignBottomIndex = pageSize - 2; //預覽圖片最後兩張空間靠下

    //如果沒有整理過的資料，才做整理，不然取用已經整理好的
    let sortFoodData = vm.getSortFoodData();
    if (sortFoodData.length === 0){
      sortFoodData = vm.sortData();
    }
    
    sortFoodData[currentPage].forEach((foodData, index) => {
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
                foodData.HostWords.length < descLimitLength
                  ? foodData.HostWords
                  : foodData.HostWords.slice(0, descLimitLength) + '...'
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
        vm.setTravelFood(foodData);
        vm.renderPagination();
        vm.setCurrentPage(1); //取完資料設定第一頁
        vm.pagination.classList.remove('js-hidden');
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