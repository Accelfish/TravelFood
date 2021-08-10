class TravelFood {
  constructor() {
    this.pageObject = {
      currentPage: 0, //目前頁碼
      totalPage: 0,   //總頁數
      pageSize: 10,   //每頁呈現的資料列
      travelFood: [], //呈現的資料來源(原始資料)
    };
    this.init();
  }

  init() {    
    this.loading = document.querySelector("#Loading");
    this.travelFoodList = document.querySelector("#TfBody");
    this.pagination = document.querySelector("#Pagination");
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
	getCurrentPage(){
		return this.pageObject.currentPage;
	}

	/**
	 * 取得已儲存的小吃資料
	 * @returns 已儲存的小吃資料
	 */
	getTravelFoodData(){
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
	 * 設定原始資料
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
    for (let i = 0; i < vm.pageItems.length; i += 1) {
      vm.pageItems[i].addEventListener("click", function () {
        for (let i = 0; i < vm.pageItems.length; i += 1) {
          vm.pageItems[i].classList.remove("tf__pageItem--active");
        }
        this.classList.add("tf__pageItem--active");
        vm.setCurrentPage(this.innerText);
      });
    }
  }

	/**
	 * 渲染頁碼
	 */
  renderPagination() {
    let vm = this;
    let totalPage = this.getTotalPage();
    let template = "";
    for (let i = 1; i <= totalPage; i += 1) {
      if (i === 1) {
        template += `<li class="text-center tf__pageItem tf__pageItem--active">${i}</li>`;
      } else {
        template += `<li class="text-center tf__pageItem">${i}</li>`;
      }
    }
    vm.pagination.innerHTML = template;
    vm.pageItems = document.getElementsByClassName("tf__pageItem");
  }

	/**
	 * 渲染表格
	 */
  renderTable() {
    let vm = this;
    let tableTemplate = "";
		let travelFoodData = vm.getTravelFoodData();
		let currentPage = vm.getCurrentPage();

    //設定渲染資料的起始Index
    let startIndex = (currentPage - 1) * vm.pageObject.pageSize + 1;

    //設定渲染資料的中止Index
    let endIndex =
      currentPage * vm.pageObject.pageSize > vm.pageObject.travelFood.length
        ? vm.pageObject.travelFood.length
        : vm.pageObject.currentPage * vm.pageObject.pageSize;

    let listIndex = 0; //每頁每列的index
    let previewImageAlignBottomIndex = 9; //預覽圖片最後兩張空間靠下

    for (let i = startIndex; i <= endIndex; i += 1) {
      let data = travelFoodData[i - 1];
      listIndex += 1;

      if (i % 2) {
        tableTemplate += `<tr class="tf__row">`;
      } else {
        tableTemplate += `<tr class="tf__row tf__row-even">`;
      }

      tableTemplate += `<td class="tf__td text-secondary text-center" title="${i}">${i}</td>
						<td class="tf__td text-center" title="${data.City}">${data.City}</td>
						<td class="tf__td" title="${data.Name}">
							<div class="inner__image">
								<img class="tf__image" src="${
                  data.PicURL
                }" loading="lazy" width="80" height="50" alt="${data.Name}">
								<div class="inner__preview ${
                  listIndex >= previewImageAlignBottomIndex
                    ? "inner__preview-bottom"
                    : ""}">
									<img class="tf__previmage" src="${data.PicURL}" width="280" height="190" alt="${data.Name}">
								</div>
							</div>
						</td>
						<td class="tf__td tf__td-name" title="${data.Name}">
							${
                data.Url
                  ? `<a class="text__link" href=${data.Url} target='_blank' title='${data.Name}'>${data.Name}</a>`
                  : data.Name
              }
						</td>
						<td class="tf__td" title="${data.HostWords}">
							${
                data.HostWords.length < 50
                  ? data.HostWords
                  : data.HostWords.slice(0, 50) + "..."
              }
				</td>
			</tr>`;
    }

    vm.travelFoodList.innerHTML = tableTemplate;
  }

	/**
	 * 呼叫API取資料
	 */
  callTravelFoodData() {
    let vm = this;
    vm.loading.classList.remove("js-hidden");
    fetch("https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx")
      .then((response) => response.json())
      .then((foodData) => {
        vm.setTotalPage(Math.ceil(foodData.length / 10));
        vm.setTravelFood(foodData);
        vm.renderPagination();
        vm.setPageItemEvent();
        vm.setCurrentPage(1); //取完資料設定第一頁
        document.getElementById("Pagination").classList.remove("js-hidden");
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        vm.loading.classList.add("js-hidden");
      });
  }
}

const travelFood = new TravelFood();
