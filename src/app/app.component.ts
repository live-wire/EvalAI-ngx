import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { Globals } from './globals';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})



export class AppComponent implements OnInit {
  private scrolledState = false;
  constructor(
  @Inject(DOCUMENT) private document: Document,
  public router: Router,
  public activatedRoute: ActivatedRoute,
  public titleService: Title,
  private globals: Globals
  ) {
    this.scrolledState = globals.scrolledState;
  }

  // Added listener for header scroll event
  @HostListener('window:scroll', [])
    onWindowScroll(): void {
    const HEADER_ELE = document.getElementById('header-static');
    if (this.document.documentElement.scrollTop > 50) {
      HEADER_ELE.style.background = 'rgba(255, 255, 255, 0.99)';
      HEADER_ELE.style.boxShadow = '0 8px 16px 0 rgba(0,0,0,0.2)';
      this.globals.scrolledState = true;
    } else {
      HEADER_ELE.style.background = 'rgba(255, 255, 255, 0)';
      HEADER_ELE.style.boxShadow = 'none';
      this.globals.scrolledState = false;
    }
    }

  ngOnInit() {
    // set page title form routes data
    this.router.events
        // filter for navigation end
      .filter((event) => event instanceof NavigationEnd)
      // check it with current activated route
      .map(() => this.activatedRoute)
      // loop state routes to get the last activated route, first child and return it
      .map((route) => {
            while (route.firstChild) {
              route = route.firstChild;
            }
            return route;
          })
          // filter for primary route
          .filter((route) => route.outlet === 'primary')
        .mergeMap((route) => route.data)
        // set platform based title service
      .subscribe((event) => this.titleService.setTitle(event['title']));
  }
}
