import React from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import classnames from 'classnames';
import Link from "next/link";

interface PaginationProps {
  totalCount: number,
  pageSize?: number,
  className?: string
}

export function Pagination({
                             totalCount,
                             pageSize = 20,
                             className
                           }: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const currentPageSection = Math.ceil(currentPage / 10) - 1;
  const pagesCount = Math.ceil(totalCount / pageSize);
  const pages = Array.from({ length: 10 }, (_, i) => (currentPageSection*10) + i + 1);

  if (pagesCount === 1) return null;

  function createPageURL (pageNumber: number | string) {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  }

  if (pages.length < 2) {
    return null;
  }
  return (
    <ul
      className={classnames('pagination-container', { [className]: className })}
    >

      {/* Left navigation arrow */}
      <Link
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        href={createPageURL(currentPage - 1)}
      >
        <div className="arrow left" />
      </Link>
      {
        currentPage !== 1 && currentPageSection !== 0 && (
          <>
            <Link
              className={classnames('pagination-item', {
                selected: false
              })}
              href={createPageURL(1)}
            >
              {1}
            </Link>
            <Link className={classnames('pagination-item', {
              selected: false
            })} href={createPageURL(
              (currentPageSection - 1)*10 + 1
            )}>
              ...
            </Link>
          </>
        )
      }
      {pages.map(pageNumber => {
        // Render our Page Pills
        return (
          <Link
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            href={createPageURL(pageNumber)}
          >
            {pageNumber}
          </Link>
        );
      })}
      {
        currentPage !== pagesCount && currentPageSection !== Math.ceil(pagesCount / 10) - 1 && (
          <>
            <Link className={classnames('pagination-item', {
              selected: false
            })} href={createPageURL(
              (currentPageSection + 1)*10 + 1
            )}>
              ...
            </Link>
            <Link
              className={classnames('pagination-item', {
                selected: false
              })}
              href={createPageURL(pagesCount)}
            >
              {pagesCount}
            </Link>
          </>
        )
      }
      {/*  Right Navigation arrow */}
      <Link
        className={classnames('pagination-item', {
          disabled: currentPage === pagesCount
        })}
        href={createPageURL(currentPage + 1)}
      >
        <div className="arrow right" />
      </Link>
    </ul>
  );
}
