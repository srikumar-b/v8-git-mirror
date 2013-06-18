// Copyright 2012 the V8 project authors. All rights reserved.
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions are
// met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above
//       copyright notice, this list of conditions and the following
//       disclaimer in the documentation and/or other materials provided
//       with the distribution.
//     * Neither the name of Google Inc. nor the names of its
//       contributors may be used to endorse or promote products derived
//       from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
// A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
// OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
// LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
// DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
// THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
// (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

// Flags: --allow-natives-syntax --expose-gc
// Flags: --parallel-recompilation --parallel-recompilation-delay=50

function assertUnoptimized(fun) {
  assertTrue(%GetOptimizationStatus(fun) != 1);
}

function assertOptimized(fun) {
  assertTrue(%GetOptimizationStatus(fun) != 2);
}

function f(x) {
  var xx = x * x;
  var xxstr = xx.toString();
  return xxstr.length;
}

function g(x) {
  var xxx = Math.sqrt(x) | 0;
  var xxxstr = xxx.toString();
  return xxxstr.length;
}

function k(x) {
  return x * x;
}

f(g(1));
assertUnoptimized(f);
assertUnoptimized(g);

%OptimizeFunctionOnNextCall(f, "parallel");
%OptimizeFunctionOnNextCall(g, "parallel");
f(g(2));  // Trigger optimization.

if (%IsParallelRecompilationSupported()) {
  assertUnoptimized(f);  // Not yet optimized.
  assertUnoptimized(g);
}

%CompleteOptimization(f);  // Wait till optimized code is installed.
%CompleteOptimization(g);

assertOptimized(f);  // Optimized now.
assertOptimized(g);
