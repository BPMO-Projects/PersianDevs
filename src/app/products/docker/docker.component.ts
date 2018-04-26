import { Component, OnInit } from '@angular/core';
import { DockerService } from './docker.service';

@Component({
  selector: 'app-docker',
  templateUrl: './docker.component.html',
  styleUrls: ['./docker.component.css']
})
export class DockerComponent implements OnInit {
  image: string;
  tag: string;
  loading: boolean = false;
  message: string = 'ایمیج و تک مورد نظر را انتخاب کنید';
  constructor(private dockerService: DockerService) { }

  ngOnInit() {
  }

  downlodDockerImage() {
    this.loading = true;
    this.message = ' درحال دانلود ایمیج ' + this.image + ':' + this.tag;
    this.dockerService.downlodDockerImage(this.image, this.tag)
      .subscribe(
        resutl => {
          this.message = ' ایمیج ' + this.image + ':' + this.tag + '  با موفقیت دانلود شد  ';
          this.loading = false;
        },
        error => {
          this.message = error;
          this.loading = false;
        });;
  }
}
