/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if(!element) {
      throw new Error('Элемент не найден')
    }
    this.element = element;
    this.registerEvents();

  }

  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    const buttonRemoveAccount = document.querySelector('.remove-account');

    buttonRemoveAccount.addEventListener('click', (e) => {
      e.preventDefault();
      this.removeAccount();
    });


    this.element.addEventListener('click', (e) => {
      e.preventDefault();
      const buttonRemoveTransaction = e.target.closest('.transaction__remove');
      if (buttonRemoveTransaction) {
          this.removeTransaction(buttonRemoveTransaction.dataset.id);
      }
    });
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (!this.lastOptions) return;

    if (confirm('Вы действительно хотите удалить этот счет?')) {
      Account.remove({ id: this.lastOptions.account_id }, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
        if (response && response.success) {
          App.updateWidgets();
          App.updateForms();
        }
      });

      this.clear();
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if (!this.lastOptions) return;

    if (confirm('Вы действительно хотите удалить эту транзакцию?')) {
      Transaction.remove({ id }, (err, response) => {
        if (err) {
          console.error(err);
          return;
        }
        if (response) {
          App.update();
        }
      });
    }
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if (!options) return;
    this.lastOptions = options;
 

    Account.get(options.account_id, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }
      if (response && response.data) {
        this.renderTitle(response.data.name);
      }
    });

    Transaction.list(options, (err, response) => {
      if (err) {
        console.error(err);
        return;
      }

      if (response && response.data) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle('Название счёта');
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
     this.element.querySelector('.content-title').textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    const dateFormat = new Date(date);
    const monthArray = [
      'января',
      'фервраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    const day = dateFormat.getDate();
    const month = monthArray[dateFormat.getMonth()];
    const fullYear = dateFormat.getFullYear() + ' г.';
    const time = dateFormat.getHours() + ':' + dateFormat.getMinutes();
    return day + ' ' + month + ' ' + fullYear + ' в ' + time;
  }
  

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){

  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const transactionListHTML = data.reduce((sumString, current) => {
      sumString += this.getTransactionHTML(current);
      return sumString;
    }, '');

    document.querySelector('.content').innerHTML = transactionListHTML;
  }
  }
