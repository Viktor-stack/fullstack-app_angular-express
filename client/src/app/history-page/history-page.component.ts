import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {MaterialInstance, MaterialService} from "../shared/classes/material.service"
import {OrdersService} from "../shared/services/orders.service"
import {Subscription} from "rxjs"
import {Order, Filter} from '../shared/interfaces'

const STEP = 2


@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip: MaterialInstance
  isFilterVisible = false
  offset = 0
  limit = STEP
  oSub: Subscription
  orders: Order[] = []
  loading = false
  reLoading = false
  noMoreOrders = false
  filter: Filter = {}

  constructor(private ordersService: OrdersService) {
  }

  ngOnInit(): void {
    this.reLoading = true
    this.fetch()
  }

  private fetch() {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.ordersService.fetch(params).subscribe(orders => {
      this.orders = this.orders.concat(orders)
      this.noMoreOrders = orders.length < STEP
      this.loading = false
      this.reLoading = false
    })
  }

  loadMore() {
    this.offset += STEP
    this.loading = true
    this.fetch()
  }


  ngOnDestroy() {
    this.tooltip.destroy()
    this.oSub.unsubscribe()
  }

  ngAfterViewInit() {
    this.tooltip = MaterialService.initTooltip(this.tooltipRef)
  }


  applyFilter(filter: Filter) {
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reLoading = true
    this.fetch()
  }

  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }
}
