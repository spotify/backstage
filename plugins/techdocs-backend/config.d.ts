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

export interface Config {
  /**
   * Configuration options for the techdocs-backend plugin
   * @see http://backstage.io/docs/features/techdocs/configuration
   */
  techdocs: {
    /**
     * Documentation building process depends on the builder attr
     * @visibility frontend
     */
    builder: 'local' | 'external';

    /**
     * Techdocs generator information
     */
    generators?: {
      techdocs: 'local' | 'docker';
    };

    /**
     * Techdocs publisher information
     */
    publisher?:
      | {
          type: 'local';
        }
      | {
          type: 'awsS3';

          /**
           * Required when 'type' is set to awsS3
           */
          awsS3?: {
            /**
             * (Optional) Credentials used to access a storage bucket.
             * If not set, environment variables or aws config file will be used to authenticate.
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-environment.html
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/loading-node-credentials-shared.html
             * @visibility secret
             */
            credentials?: {
              /**
               * User access key id
               * @visibility secret
               */
              accessKeyId: string;
              /**
               * User secret access key
               * @visibility secret
               */
              secretAccessKey: string;
              /**
               * ARN of role to be assumed
               * @visibility backend
               */
              roleArn?: string;
            };
            /**
             * (Required) Cloud Storage Bucket Name
             * @visibility backend
             */
            bucketName: string;
            /**
             * (Optional) AWS Region.
             * If not set, AWS_REGION environment variable or aws config file will be used.
             * @see https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-region.html
             * @visibility secret
             */
            region?: string;
            /**
             * (Optional) AWS Endpoint.
             * The endpoint URI to send requests to. The default endpoint is built from the configured region.
             * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
             * @visibility secret
             */
            endpoint?: string;
            /**
             * (Optional) Whether to use path style URLs when communicating with S3.
             * Defaults to false.
             * This allows providers like LocalStack, Minio and Wasabi (and possibly others) to be used to host tech docs.
             * @visibility backend
             */
            s3ForcePathStyle?: boolean;
          };
        }
      | {
          type: 'openStackSwift';

          /**
           * Required when 'type' is set to openStackSwift
           */
          openStackSwift?: {
            /**
             * (Required) Credentials used to access a storage bucket.
             * @see https://docs.openstack.org/api-ref/identity/v3/?expanded=password-authentication-with-unscoped-authorization-detail#password-authentication-with-unscoped-authorization
             * @visibility secret
             */
            credentials: {
              /**
               * (Required) Root user name
               * @visibility secret
               */
              username: string;
              /**
               * (Required) Root user password
               * @visibility secret
               */
              password: string; // required
            };
            /**
             * (Required) Cloud Storage Container Name
             * @visibility backend
             */
            containerName: string;
            /**
             * (Required) Auth url sometimes OpenStack uses different port check your OpenStack apis.
             * @visibility backend
             */
            authUrl: string;
            /**
             * (Optional) Auth version
             * If not set, 'v2.0' will be used.
             * @visibility backend
             */
            keystoneAuthVersion: string;
            /**
             * (Required) Domain Id
             * @visibility backend
             */
            domainId: string;
            /**
             * (Required) Domain Name
             * @visibility backend
             */
            domainName: string;
            /**
             * (Required) Region
             * @visibility backend
             */
            region: string;
          };
        }
      | {
          type: 'azureBlobStorage';

          /**
           * Required when 'type' is set to azureBlobStorage
           */
          azureBlobStorage?: {
            /**
             * (Required) Credentials used to access a storage container.
             * @visibility secret
             */
            credentials: {
              /**
               * Account access name
               * @visibility secret
               */
              accountName: string;
              /**
               * (Optional) Account secret primary key
               * If not set, environment variables will be used to authenticate.
               * @see https://docs.microsoft.com/en-us/azure/storage/common/storage-auth?toc=/azure/storage/blobs/toc.json
               * @visibility secret
               */
              accountKey?: string;
            };
            /**
             * (Required) Cloud Storage Container Name
             * @visibility backend
             */
            containerName: string;
          };
        }
      | {
          type: 'googleGcs';

          /**
           * Required when 'type' is set to googleGcs
           */
          googleGcs?: {
            /**
             * (Required) Cloud Storage Bucket Name
             * @visibility backend
             */
            bucketName: string;
            /**
             * (Optional) API key used to write to a storage bucket.
             * If not set, environment variables will be used to authenticate.
             * @see  https://cloud.google.com/docs/authentication/production
             * @visibility secret
             */
            credentials?: string;
          };
        };

    /**
     * @example http://localhost:7000/api/techdocs
     * @visibility frontend
     * @deprecated
     */
    requestUrl?: string;

    /**
     * @example http://localhost:7000/api/techdocs/static/docs
     * @deprecated
     */
    storageUrl?: string;
  };
}
