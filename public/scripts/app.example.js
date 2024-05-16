class App {
  constructor() {
    this.loadButton = document.getElementById("load-btn");
    this.carContainerElement = document.getElementById("cars-container");
    this.carsSelect = document.getElementById("cars-select");
    this.dateInput = document.getElementById('date').value;
    this.timeInput = document.getElementById('time').value;
    this.capacity = document.getElementById('capacity').value;
    this.typeDriver = "";
  }

  async init() {
    // await this.initial();
    this.loadButton.onclick = () => {
      this.clear();
      this.load(this.typeDriver).then(() => this.run());
    };
    this.carsSelect.onchange = () => {
      this.typeDriver = this.carsSelect.value;
      localStorage.setItem("TYPE_DRIVER", this.typeDriver);
    };
  }

  async initial() {
    console.log("init");
    const cars = await Binar.listCars();
    Car.init(cars);
  }

  run = () => {
    Car.list.forEach((car) => {
      const node = document.createElement("div");
      node.innerHTML = car.render();
      this.carContainerElement.appendChild(node);
    });
  };

  async load(typeDriver = "") {
    const dateInput = document.getElementById('date').value;
    const timeInput = document.getElementById('time').value;
    const capacity = document.getElementById('capacity').value;

    if (typeDriver === "") {
      alert("Silahkan pilih tipe driver");
      return;
    }
    if (!dateInput || !timeInput) {
      alert("Silahkan masukan waktu dan tanggal");
      return;
    }

    // Convert string date and time to Date object
    const datetime = new Date(`${dateInput}T${timeInput}`);
    const cars = await Binar.listCars(car => {
      let filterCar = car.availableAt >= datetime;
      if (capacity) {
        filterCar = filterCar && car.capacity >= parseInt(capacity);
      }
      return filterCar;
    });
    Car.init(cars);
  }


  clear = () => {
    let child = this.carContainerElement.firstElementChild;

    while (child) {
      child.remove();
      child = this.carContainerElement.firstElementChild;
    }
  };
}
