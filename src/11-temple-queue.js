/**
 * 🛕 Mandir Darshan Queue - Static Methods, Getters/Setters, Symbol.iterator
 *
 * Mandir mein darshan ke liye queue management system banana hai! Advanced
 * OOP features use karo — getters/setters se controlled access, static
 * methods se utility functions, aur Symbol.iterator se queue ko for...of
 * loop mein iterate karo. VIP devotees ko special treatment milega!
 *
 * Class: TempleQueue
 *
 *   Private Fields:
 *     #devotees    - Array of devotee objects
 *     #maxCapacity - Maximum queue capacity
 *     #vipEnabled  - Boolean: VIP lane active or not
 *
 *   constructor(templeName, maxCapacity)
 *     - this.templeName = templeName (public)
 *     - this.#devotees = []
 *     - this.#maxCapacity = maxCapacity (must be > 0, default 100)
 *     - this.#vipEnabled = false
 *
 *   Getters:
 *     get length()     - Returns number of devotees in queue
 *     get isEmpty()    - Returns true if queue has no devotees
 *     get vipEnabled() - Returns current VIP enabled status
 *
 *   Setters:
 *     set vipEnabled(value)
 *       - Only accepts boolean values
 *       - If non-boolean passed, throw TypeError("VIP status must be a boolean")
 *       - Sets this.#vipEnabled
 *
 *   Instance Methods:
 *
 *     enqueue(name, type)
 *       - type: "regular" or "vip"
 *       - If type invalid (not "regular" or "vip"): return null
 *       - If name is empty/falsy: return null
 *       - If queue is full (#devotees.length >= #maxCapacity): return null
 *       - Creates devotee: { name, type, joinedAt: new Date().toISOString() }
 *       - If type is "vip" AND #vipEnabled is true: add to FRONT of queue (unshift)
 *       - If type is "vip" AND #vipEnabled is false: treat as regular (add to back)
 *       - If type is "regular": add to BACK of queue (push)
 *       - Returns the devotee object
 *
 *     dequeue()
 *       - Removes and returns the FIRST devotee from queue
 *       - Returns null if queue is empty
 *
 *     peek()
 *       - Returns the FIRST devotee WITHOUT removing
 *       - Returns null if queue is empty
 *
 *     contains(name)
 *       - Returns true if a devotee with that name is in the queue
 *       - Returns false otherwise
 *
 *     toArray()
 *       - Returns a COPY of the devotees array
 *       - Modifying returned array should not affect internal queue
 *
 *   Static Methods:
 *
 *     static merge(queue1, queue2)
 *       - Takes two TempleQueue instances
 *       - Creates a NEW TempleQueue with name "${queue1.templeName}-${queue2.templeName}"
 *       - maxCapacity = queue1's capacity + queue2's capacity (use length as approximation
 *         or accept sum of both toArray lengths + some buffer)
 *       - Adds all devotees from queue1 first, then queue2 (maintaining order)
 *       - Returns the new merged queue
 *
 *     static fromArray(templeName, maxCapacity, arr)
 *       - Creates a new TempleQueue from an array of name strings
 *       - Each name becomes a "regular" type devotee
 *       - Returns the new queue
 *       - If arr is not an array, return empty queue
 *
 *   Iterator:
 *
 *     [Symbol.iterator]()
 *       - Makes the queue iterable with for...of
 *       - Yields each devotee object in order (front to back)
 *       - Does NOT remove devotees (non-destructive iteration)
 *
 * Rules:
 *   - Private fields must use # syntax
 *   - Getters/setters must use get/set keyword syntax
 *   - Static methods must use static keyword
 *   - Symbol.iterator must be implemented as a generator or return iterator protocol
 *   - VIP enqueue only works when vipEnabled is true
 *   - Queue should never exceed maxCapacity
 *   - toArray and merge should return copies, not references
 *   - fromArray creates regular devotees only
 *
 * @example
 *   const queue = new TempleQueue("Kashi Vishwanath", 50);
 *   queue.enqueue("Ram", "regular");
 *   queue.enqueue("Shyam", "regular");
 *   queue.length;     // => 2
 *   queue.isEmpty;    // => false
 *
 *   queue.vipEnabled = true;
 *   queue.enqueue("VIP Sharma", "vip");
 *   queue.peek();     // => { name: "VIP Sharma", type: "vip", ... } (front!)
 *
 *   queue.dequeue();  // => { name: "VIP Sharma", ... }
 *   queue.length;     // => 2
 *
 * @example
 *   const q = TempleQueue.fromArray("Test Mandir", 10, ["A", "B", "C"]);
 *   q.length;  // => 3
 *
 * @example
 *   const queue = new TempleQueue("Mandir", 10);
 *   queue.enqueue("A", "regular");
 *   queue.enqueue("B", "regular");
 *   for (const devotee of queue) {
 *     console.log(devotee.name);  // "A", then "B"
 *   }
 */
export class TempleQueue {
  #devotees;
  #maxCapacity;
  #vipEnabled;

  constructor(templeName, maxCapacity) {
    this.templeName = templeName;
    this.#devotees = [];
    this.#maxCapacity = maxCapacity > 0 ? maxCapacity : 100;
    this.#vipEnabled = false;
  }

  get length() {
    return this.#devotees.length;
  }

  get isEmpty() {
    return this.#devotees.length === 0 ? true : false;
  }

  get vipEnabled() {
    return this.#vipEnabled;
  }

  set vipEnabled(value) {
    if (typeof value !== "boolean")
      throw TypeError("VIP status must be a boolean");
    this.#vipEnabled = value;
  }

  enqueue(name, type) {
    if (
      !type ||
      (type !== "regular" && type !== "vip") ||
      !name ||
      this.#devotees.length >= this.#maxCapacity
    )
      return null;
    const devotee = {
      name,
      type,
      joinedAt: new Date().toISOString(),
    };
    if (type === "vip" && this.#vipEnabled) this.#devotees.unshift(devotee);
    else this.#devotees.push(devotee);

    return devotee;
  }

  dequeue() {
    if (this.#devotees.length === 0) return null;
    return this.#devotees.shift();
  }

  peek() {
    if (this.#devotees.length === 0) return null;
    return this.#devotees[0];
  }

  contains(name) {
    const devotee = this.#devotees.some((e) => e.name === name);
    if (devotee) return true;
    else return false;
  }

  toArray() {
    return structuredClone(this.#devotees);
  }

  static merge(queue1, queue2) {
    const mergedTempleName = `${queue1.templeName}-${queue2.templeName}`;
    const mergedMaxCapacity = queue1.#maxCapacity + queue2.#maxCapacity;
    const mergedQueue = new TempleQueue(mergedTempleName, mergedMaxCapacity);
    queue1.toArray().forEach((devotee) => {
      mergedQueue.enqueue(devotee.name, devotee.type);
    });
    queue2.toArray().forEach((devotee) => {
      mergedQueue.enqueue(devotee.name, devotee.type);
    });
    return mergedQueue;
    // const mergedQueue = new TempleQueue(queue1.)
  }

  static fromArray(templeName, maxCapacity, arr) {
    if ((!arr, !Array.isArray(arr)))
      return new TempleQueue(templeName, maxCapacity);
    const newTempleQueue = new TempleQueue(templeName, maxCapacity);
    arr.forEach((name) => {
      newTempleQueue.enqueue(name, "regular");
    });
    return newTempleQueue;
  }

  [Symbol.iterator]() {
    let index = 0;
    const devotees = this.#devotees;
    return {
      next() {
        if (index < devotees.length) {
          return { value: devotees[index++], done: false };
        } else {
          return { done: true };
        }
      },
    };
  }
}
