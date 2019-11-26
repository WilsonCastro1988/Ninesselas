import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-home-user',
  templateUrl: './home-user.component.html',
  styleUrls: ['./home-user.component.css']
})
export class HomeUserComponent implements OnInit {
  userInfo;
  avatarImageUrl;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.authService.getUser().subscribe(
      res => {
        this.userInfo = res;
      });
    // this.authService.getAvatar()
    //   .subscribe(resp => {
    //     this.avatarImageUrl = resp;
    //     console.log('segunda ' );
    //     console.log(JSON.stringify(resp));
    //   });
  }

}
