/*
 * Copyright 2020 The Backstage Authors
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

import { BehaviorSubject } from '../subjects';
import { Observable, SessionState } from '@backstage/core-plugin-api';

export class SessionStateTracker {
  private readonly subject = new BehaviorSubject<SessionState>(
    SessionState.SignedOut,
  );

  private signedIn: boolean = false;

  setIsSignedIn(isSignedIn: boolean) {
    if (this.signedIn !== isSignedIn) {
      this.signedIn = isSignedIn;
      this.subject.next(
        this.signedIn ? SessionState.SignedIn : SessionState.SignedOut,
      );
    }
  }

  sessionState$(): Observable<SessionState> {
    return this.subject;
  }
}
