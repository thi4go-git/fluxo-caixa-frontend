import { Component, AfterViewInit } from '@angular/core';


declare var $: any;


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements AfterViewInit {

  href: string | undefined;

  ngAfterViewInit() {
    (($) => {
      "use strict";
      var path = window.location.href;
      $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(() => {
        if (this.href === path) {
          $(this).addClass("active");
        }
      });
      $("#sidebarToggle2").on("click", function (e: { preventDefault: () => void; }) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
      });
    })($);
  }

}
