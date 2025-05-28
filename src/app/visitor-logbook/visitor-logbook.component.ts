import { Component, OnInit } from '@angular/core';
import { VisitorService } from '../services/visitor.service'; // Import service
import { Visitor } from '../models/visitor.model';

@Component({
  selector: 'app-visitor-logbook',
  templateUrl: './visitor-logbook.component.html',
  styleUrls: ['./visitor-logbook.component.css']
})
export class VisitorLogbookComponent implements OnInit {

  // Filter properties
  searchTerm: string = '';
  selectedDate: string = '';
  selectedCertificateFilter: string = 'all';
  
  // Filtered visitors array
  filteredVisitors: Visitor[] = [];
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  paginatedVisitors: any[] = [];
  customPageInput: string = '';
  allVisitors: Visitor[] = []; // To store the original list
  
  // Expose Math to template
  Math = Math;

  constructor(private visitorService: VisitorService) {} // Inject service

  ngOnInit(): void {
    this.visitorService.getVisitors().subscribe(data => {
      this.allVisitors = data;
      this.applyFilters(); // Apply initial filters (which will also paginate)
    });
  }

  toggleVisitor(index: number): void {
    // Find the original visitor in the main array using the paginated visitor
    const paginatedVisitor = this.paginatedVisitors[index];
    const originalIndex = this.allVisitors.findIndex(v => v.clientId === paginatedVisitor.clientId && v.date === paginatedVisitor.date && v.time === paginatedVisitor.time); // More robust find
    if (originalIndex !== -1) {
      this.allVisitors[originalIndex].open = !this.allVisitors[originalIndex].open;
      this.updatePagination(); // Refresh paginated list without changing filters
    }
  }

  applyFilters(): void {
    this.filteredVisitors = this.allVisitors.filter(visitor => {
      // Search filter
      const matchesSearch = this.searchTerm === '' || 
        `${visitor.firstname} ${visitor.lastname}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        visitor.clientId.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        visitor.agency.toLowerCase().includes(this.searchTerm.toLowerCase());

      // Date filter
      const matchesDate = this.selectedDate === '' || visitor.date === this.selectedDate;

      // Certificate filter
      let matchesCertificate = true;
      if (this.selectedCertificateFilter === 'certificate') {
        matchesCertificate = visitor.status === 'Printed';
      } else if (this.selectedCertificateFilter === 'no-certificate') {
        matchesCertificate = visitor.status === 'Not Printed';
      }
      // 'all' and 'print-all' show all visitors

      return matchesSearch && matchesDate && matchesCertificate;
    });
    
    // Reset to first page when filters change
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredVisitors.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedVisitors = this.filteredVisitors.slice(startIndex, endIndex);
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onDateChange(): void {
    this.applyFilters();
  }

  onCertificateFilterChange(): void {
    this.applyFilters();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedDate = '';
    this.selectedCertificateFilter = 'all';
    this.applyFilters();
  }

  printAll(): void {
    // Placeholder for print functionality
    console.log('Printing all filtered visitors:', this.filteredVisitors);
    // Here you would implement actual printing functionality
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  onCustomPageInput(): void {
    const pageNumber = parseInt(this.customPageInput);
    if (!isNaN(pageNumber)) {
      this.goToPage(pageNumber);
      this.customPageInput = '';
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxPagesToShow = 5;
    
    if (this.totalPages <= maxPagesToShow) {
      // If total pages is less than max pages to show, show all pages
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculate range to show around current page
      let start = Math.max(1, this.currentPage - Math.floor(maxPagesToShow / 2));
      let end = start + maxPagesToShow - 1;
      
      // Adjust if end exceeds total pages
      if (end > this.totalPages) {
        end = this.totalPages;
        start = Math.max(1, end - maxPagesToShow + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }
}
