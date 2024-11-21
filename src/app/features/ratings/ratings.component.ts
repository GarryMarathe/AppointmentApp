import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, Output,EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-ratings',
  standalone: true,
  imports: [CommonModule,MatIcon,MatTooltip],
  templateUrl: './ratings.component.html',
  styleUrl: './ratings.component.css'
})
export class RatingsComponent implements OnInit{
  @Input() rating: number = 0; // Start with no default rating
  @Input() starCount: number = 5;
  @Input() color: string = 'accent';
  @Output() ratingUpdated = new EventEmitter<number>();

  public ratingArr: number[] = [];

  constructor() {}

  ngOnInit() {
    this.ratingArr = Array(this.starCount).fill(0).map((x, i) => i);
  }

  onClick(rating: number) {
    this.ratingUpdated.emit(rating); // Emit the updated rating
    this.rating = rating; // Update the rating
  }

  showIcon(index: number) {
    return this.rating >= index + 1 ? 'star' : 'star_border'; // Show filled or empty star
  }

}
