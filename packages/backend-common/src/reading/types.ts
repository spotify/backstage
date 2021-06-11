/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Readable } from 'stream';
import { Logger } from 'winston';
import { Config } from '@backstage/config';

/**
 * A generic interface for fetching plain data from URLs.
 */
export type UrlReader = {
  read(url: string): Promise<Buffer>;
  readTree(url: string, options?: ReadTreeOptions): Promise<ReadTreeResponse>;
  search(url: string, options?: SearchOptions): Promise<SearchResponse>;
};

export type UrlReaderPredicateTuple = {
  predicate: (url: URL) => boolean;
  reader: UrlReader;
};

/**
 * A factory function that can read config to construct zero or more
 * UrlReaders along with a predicate for when it should be used.
 */
export type ReaderFactory = (options: {
  config: Config;
  logger: Logger;
  treeResponseFactory: ReadTreeResponseFactory;
}) => UrlReaderPredicateTuple[];

/**
 * An options object for readTree operations.
 */
export type ReadTreeOptions = {
  /**
   * A filter that can be used to select which files should be included.
   *
   * The path passed to the filter function is the relative path from the URL
   * that the file tree is fetched from, without any leading '/'.
   *
   * For example, given the URL https://github.com/my/repo/tree/master/my-dir, a file
   * at https://github.com/my/repo/blob/master/my-dir/my-subdir/my-file.txt will
   * be represented as my-subdir/my-file.txt
   *
   * If no filter is provided all files are extracted.
   */
  filter?(path: string): boolean;

  /**
   * An etag can be provided to check whether readTree's response has changed from a previous execution.
   *
   * In the readTree() response, an etag is returned along with the tree blob. The etag is a unique identifer
   * of the tree blob, usually the commit SHA or etag from the target.
   *
   * When a etag is given in ReadTreeOptions, readTree will first compare the etag against the etag
   * on the target branch. If they match, readTree will throw a NotModifiedError indicating that the readTree
   * response will not differ from the previous response which included this particular etag. If they mismatch,
   * readTree will return the rest of ReadTreeResponse along with a new etag.
   */
  etag?: string;
};

export type ReadTreeResponse = {
  /**
   * files() returns an array of all the files inside the tree and corresponding functions to read their content.
   */
  files(): Promise<ReadTreeResponseFile[]>;
  archive(): Promise<NodeJS.ReadableStream>;

  /**
   * dir() extracts the tree response into a directory and returns the path of the directory.
   */
  dir(options?: ReadTreeResponseDirOptions): Promise<string>;

  /**
   * A unique identifer of the tree blob, usually the commit SHA or etag from the target.
   */
  etag: string;
};

export type ReadTreeResponseDirOptions = {
  /** The directory to write files to. Defaults to the OS tmpdir or `backend.workingDirectory` if set in config */
  targetDir?: string;
};

/**
 * Represents a single file in a readTree response.
 */
export type ReadTreeResponseFile = {
  path: string;
  content(): Promise<Buffer>;
};

export type FromArchiveOptions = {
  // A binary stream of a tar archive.
  stream: Readable;
  // If unset, the files at the root of the tree will be read.
  // subpath must not contain the name of the top level directory.
  subpath?: string;
  // etag of the blob
  etag: string;
  // Filter passed on from the ReadTreeOptions
  filter?: (path: string) => boolean;
};

export interface ReadTreeResponseFactory {
  fromTarArchive(options: FromArchiveOptions): Promise<ReadTreeResponse>;
  fromZipArchive(options: FromArchiveOptions): Promise<ReadTreeResponse>;
}

/**
 * An options object for search operations.
 */
export type SearchOptions = {
  /**
   * An etag can be provided to check whether the search response has changed from a previous execution.
   *
   * In the search() response, an etag is returned along with the files. The etag is a unique identifer
   * of the current tree, usually the commit SHA or etag from the target.
   *
   * When an etag is given in SearchOptions, search will first compare the etag against the etag
   * on the target branch. If they match, search will throw a NotModifiedError indicating that the search
   * response will not differ from the previous response which included this particular etag. If they mismatch,
   * search will return the rest of SearchResponse along with a new etag.
   */
  etag?: string;
};

/**
 * The output of a search operation.
 */
export type SearchResponse = {
  /**
   * The files that matched the search query.
   */
  files: SearchResponseFile[];

  /**
   * A unique identifer of the current remote tree, usually the commit SHA or etag from the target.
   */
  etag: string;
};

/**
 * Represents a single file in a search response.
 */
export type SearchResponseFile = {
  /**
   * The full URL to the file.
   */
  url: string;

  /**
   * The binary contents of the file.
   */
  content(): Promise<Buffer>;
};
