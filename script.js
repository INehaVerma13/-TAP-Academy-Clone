/* ==========================================================================
   TAP ACADEMY CLONE - JAVASCRIPT ENGINE
   Controls: Theme toggles, Stats animation, DSA simulator (Sorting & Stack),
             Live JS Sandbox playground, Modal downloads, and Registration Wizard.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initMobileNav();
    initStatsCounter();
    initDsaSimulator();
    initCodePlayground();
    initFaqAccordion();
    initSyllabusDownload();
    initLoginModal();
    initTestimonialSlider();
    initHeroSlider();
});

/* ==========================================================================
   1. THEME SWITCHING (Dark / Light)
   ========================================================================== */
function initTheme() {
    const themeBtn = document.getElementById("theme-toggle-btn");
    const htmlEl = document.documentElement;

    // Check saved preference or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
        htmlEl.setAttribute("data-theme", savedTheme);
    } else {
        htmlEl.setAttribute("data-theme", systemDark ? "dark" : "light");
    }

    themeBtn.addEventListener("click", () => {
        const currentTheme = htmlEl.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        htmlEl.setAttribute("data-theme", newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
    const hamburger = document.getElementById("menu-hamburger-btn");
    const mobileNav = document.getElementById("mobile-nav");
    const navLinks = document.querySelectorAll(".mobile-nav-link");

    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        mobileNav.classList.toggle("active");
    });

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            mobileNav.classList.remove("active");
        });
    });
}

/* ==========================================================================
   3. ANIMATED STATISTICS COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statsGroup = document.getElementById("stats-counter-group");
    const statNumbers = document.querySelectorAll(".stat-number");
    let animated = false;

    if (!statsGroup) return;

    const countUp = () => {
        statNumbers.forEach(num => {
            const target = parseFloat(num.getAttribute("data-target"));
            const duration = 2000; // 2 seconds
            const steps = 60;
            const stepTime = duration / steps;
            let current = 0;
            const increment = target / steps;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                
                // Formatting values (e.g. floats vs integers)
                if (target % 1 === 0) {
                    num.textContent = Math.floor(current);
                } else {
                    num.textContent = current.toFixed(1);
                }
            }, stepTime);
        });
    };

    // Trigger animation when group enters viewport
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                countUp();
                animated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    observer.observe(statsGroup);
}

/* ==========================================================================
   4. INTERACTIVE DSA SIMULATOR (Bubble Sort & Stack)
   ========================================================================== */
function initDsaSimulator() {
    // Tab switching
    const tabs = document.querySelectorAll(".sim-tab");
    const panes = document.querySelectorAll(".sim-pane");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            panes.forEach(p => p.classList.remove("active"));

            tab.classList.add("active");
            const simName = tab.getAttribute("data-sim");
            document.getElementById(`pane-${simName}`).classList.add("active");
        });
    });

    /* --- BUBBLE SORT WORKSPACE --- */
    const sortContainer = document.getElementById("sort-bars-container");
    const btnReset = document.getElementById("btn-sort-reset");
    const btnStart = document.getElementById("btn-sort-start");
    const speedSelect = document.getElementById("sort-speed");
    const explanationEl = document.getElementById("sort-explanation");

    let sortArray = [];
    let isSorting = false;
    let stopSortingRequested = false;

    // Helper sleep timer
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    function generateRandomArray(size = 10) {
        sortArray = [];
        sortContainer.innerHTML = "";
        for (let i = 0; i < size; i++) {
            const val = Math.floor(Math.random() * 80) + 15; // 15 to 95 range
            sortArray.push(val);

            // Create bar
            const bar = document.createElement("div");
            bar.classList.add("bar");
            bar.style.height = `${val * 2.5}px`; // scale for rendering
            bar.setAttribute("data-val", val);
            bar.textContent = val;
            sortContainer.appendChild(bar);
        }
        explanationEl.innerHTML = `<span class="info-icon">ℹ️</span> New array generated. Array: [${sortArray.join(", ")}]. Click "Start Bubble Sort" to visualize.`;
        btnStart.disabled = false;
    }

    async function bubbleSort() {
        isSorting = true;
        btnStart.disabled = true;
        btnReset.disabled = true;
        speedSelect.disabled = true;
        stopSortingRequested = false;

        const bars = sortContainer.querySelectorAll(".bar");
        const n = sortArray.length;

        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (stopSortingRequested) break;

                const speed = parseInt(speedSelect.value);

                // Highlight compared elements
                bars[j].classList.add("compare");
                bars[j + 1].classList.add("compare");
                explanationEl.innerHTML = `🔍 Comparing elements at index <strong>${j}</strong> (${sortArray[j]}) and <strong>${j+1}</strong> (${sortArray[j+1]})`;
                
                await sleep(speed);

                if (sortArray[j] > sortArray[j + 1]) {
                    bars[j].classList.remove("compare");
                    bars[j + 1].classList.remove("compare");
                    bars[j].classList.add("swap");
                    bars[j + 1].classList.add("swap");
                    explanationEl.innerHTML = `🔄 <strong>Swap:</strong> ${sortArray[j]} &gt; ${sortArray[j+1]}, so we swap them.`;

                    // Swap values in JS array
                    let temp = sortArray[j];
                    sortArray[j] = sortArray[j + 1];
                    sortArray[j + 1] = temp;

                    // Swap visual heights
                    bars[j].style.height = `${sortArray[j] * 2.5}px`;
                    bars[j].textContent = sortArray[j];
                    bars[j + 1].style.height = `${sortArray[j + 1] * 2.5}px`;
                    bars[j + 1].textContent = sortArray[j + 1];

                    await sleep(speed);
                    
                    bars[j].classList.remove("swap");
                    bars[j + 1].classList.remove("swap");
                } else {
                    explanationEl.innerHTML = `✅ <strong>No Swap:</strong> ${sortArray[j]} &le; ${sortArray[j+1]}, correct order.`;
                    await sleep(speed / 2);
                    bars[j].classList.remove("compare");
                    bars[j + 1].classList.remove("compare");
                }
            }
            
            // Mark the last element of this pass as sorted
            bars[n - i - 1].classList.add("sorted");
        }
        
        // Mark first element as sorted when loop terminates
        bars[0].classList.add("sorted");
        
        explanationEl.innerHTML = `🎉 <strong>Sorted!</strong> Bubble Sort complete. Array: [${sortArray.join(", ")}].`;
        isSorting = false;
        btnStart.disabled = true;
        btnReset.disabled = false;
        speedSelect.disabled = false;
    }

    btnReset.addEventListener("click", () => {
        generateRandomArray();
    });

    btnStart.addEventListener("click", () => {
        if (!isSorting) {
            bubbleSort();
        }
    });

    // Baseline load
    generateRandomArray();


    /* --- STACK WORKSPACE --- */
    const stackInput = document.getElementById("stack-input");
    const btnPush = document.getElementById("btn-stack-push");
    const btnPop = document.getElementById("btn-stack-pop");
    const btnClear = document.getElementById("btn-stack-clear");
    const stackItemsBox = document.getElementById("stack-items-container");
    const stackLog = document.getElementById("stack-log-console");
    const emptyMsg = document.getElementById("stack-empty-msg");

    let stackArray = [];
    const maxStackSize = 6;

    function updateStackUI(action, value) {
        // Clear children except empty message
        stackItemsBox.querySelectorAll(".stack-item").forEach(el => el.remove());

        if (stackArray.length === 0) {
            emptyMsg.style.display = "block";
        } else {
            emptyMsg.style.display = "none";
            
            // Rebuild elements
            stackArray.forEach((val, idx) => {
                const item = document.createElement("div");
                item.classList.add("stack-item");
                item.textContent = val;
                
                // Highlight TOP item (Peek)
                if (idx === stackArray.length - 1) {
                    item.classList.add("peek-highlight");
                    
                    // Label top indicator
                    const badge = document.createElement("span");
                    badge.style.position = "absolute";
                    badge.style.right = "-45px";
                    badge.style.fontSize = "0.65rem";
                    badge.style.fontWeight = "700";
                    badge.style.backgroundColor = "var(--accent-secondary)";
                    badge.style.color = "white";
                    badge.style.padding = "2px 6px";
                    badge.style.borderRadius = "4px";
                    badge.textContent = "TOP";
                    item.appendChild(badge);
                }

                stackItemsBox.appendChild(item);
            });
        }

        // Add log entry
        const entry = document.createElement("div");
        entry.classList.add("log-entry");
        
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        if (action === "push") {
            entry.classList.add("push");
            entry.innerHTML = `[${timestamp}] 📥 PUSH(${value}) -> Stack size: ${stackArray.length}`;
        } else if (action === "pop") {
            entry.classList.add("pop");
            entry.innerHTML = `[${timestamp}] 📤 POP() -> Extracted: ${value}`;
        } else if (action === "clear") {
            entry.classList.add("clear");
            entry.innerHTML = `[${timestamp}] 🧹 CLEAR -> Stack cleared.`;
        } else if (action === "error") {
            entry.classList.add("error-line");
            entry.innerHTML = `[${timestamp}] ⚠️ ERROR: ${value}`;
        }

        stackLog.appendChild(entry);
        stackLog.scrollTop = stackLog.scrollHeight;
    }

    btnPush.addEventListener("click", () => {
        const valStr = stackInput.value.trim();
        if (!valStr) {
            updateStackUI("error", "Input value cannot be empty!");
            return;
        }
        const val = parseInt(valStr);
        if (isNaN(val) || val < 1 || val > 99) {
            updateStackUI("error", "Provide value between 1 and 99");
            return;
        }

        if (stackArray.length >= maxStackSize) {
            updateStackUI("error", "Stack Overflow! Max capacity reached.");
            return;
        }

        stackArray.push(val);
        stackInput.value = "";
        updateStackUI("push", val);
    });

    btnPop.addEventListener("click", () => {
        if (stackArray.length === 0) {
            updateStackUI("error", "Stack Underflow! No items to pop.");
            return;
        }
        const popped = stackArray.pop();
        updateStackUI("pop", popped);
    });

    btnClear.addEventListener("click", () => {
        stackArray = [];
        updateStackUI("clear");
    });
}

/* ==========================================================================
   5. MINI CODE PLAYGROUND
   ========================================================================== */
function initCodePlayground() {
    const editor = document.getElementById("editor-textarea");
    const codePresets = document.getElementById("code-presets");
    const btnRun = document.getElementById("btn-run-code");
    const btnClearConsole = document.getElementById("btn-clear-console");
    const consoleOutput = document.getElementById("console-output");

    const codeTemplates = {
        hello: `// Interactive Code Playground
function runDemo() {
    let message = "Welcome to Tap Academy Code Arena!";
    console.log(message);
    
    // Add simple calculation
    let total = 0;
    for(let i = 1; i <= 5; i++) {
        total += i;
        console.log("Current index: " + i + ", running sum: " + total);
    }
    
    console.log("Final Sum (1 to 5): " + total);
}

runDemo();`,
        factorial: `// Factorial Calculation
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

let num = 6;
let result = factorial(num);
console.log("Factorial of " + num + " is: " + result);`,
        fibonacci: `// Fibonacci Series Generator
function generateFibonacci(limit) {
    let fib = [0, 1];
    console.log("Index 0: " + fib[0]);
    console.log("Index 1: " + fib[1]);

    for (let i = 2; i < limit; i++) {
        fib[i] = fib[i - 1] + fib[i - 2];
        console.log("Index " + i + ": " + fib[i]);
    }
    
    console.log("Complete Series: " + fib.join(", "));
}

generateFibonacci(8);`
    };

    // Change presets
    codePresets.addEventListener("change", () => {
        const val = codePresets.value;
        if (codeTemplates[val]) {
            editor.value = codeTemplates[val];
            updateLineNumbers();
        }
    });

    function updateLineNumbers() {
        const lines = editor.value.split("\n").length;
        const lineBox = document.querySelector(".line-numbers");
        lineBox.innerHTML = "";
        for (let i = 1; i <= Math.max(lines, 12); i++) {
            const span = document.createElement("span");
            span.textContent = i;
            lineBox.appendChild(span);
        }
    }

    // Adjust line numbers on user typing
    editor.addEventListener("input", updateLineNumbers);

    // Sandbox execution of Javascript code
    btnRun.addEventListener("click", () => {
        const userCode = editor.value;
        
        // Log clean
        consoleOutput.innerHTML = `<div class="console-line system-line">[Running sandbox execution...]</div>`;

        // Capture console.log
        const logs = [];
        const originalLog = console.log;
        console.log = function(...args) {
            logs.push(args.map(arg => {
                if (typeof arg === 'object') return JSON.stringify(arg);
                return String(arg);
            }).join(" "));
        };

        try {
            // Standard JS eval inside local wrap scope
            const evalResult = new Function(userCode);
            evalResult();
            
            // Restore console.log
            console.log = originalLog;

            // Output captured logs
            if (logs.length === 0) {
                consoleOutput.innerHTML += `<div class="console-line system-line">Code executed successfully (No outputs returned).</div>`;
            } else {
                logs.forEach(msg => {
                    const line = document.createElement("div");
                    line.classList.add("console-line");
                    line.textContent = msg;
                    consoleOutput.appendChild(line);
                });
            }
        } catch (error) {
            console.log = originalLog; // Restore console if crashed
            const errLine = document.createElement("div");
            errLine.classList.add("console-line", "error-line");
            errLine.textContent = `❌ ${error.name}: ${error.message}`;
            consoleOutput.appendChild(errLine);
        }

        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    });

    btnClearConsole.addEventListener("click", () => {
        consoleOutput.innerHTML = `<div class="console-line system-line">[System] Console cleared. Playground ready.</div>`;
    });

    // Initialize line numbers
    updateLineNumbers();
}

/* ==========================================================================
   6. FAQ ACCORDION HANDLER
   ========================================================================== */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach(item => {
        const trigger = item.querySelector(".faq-trigger");
        trigger.addEventListener("click", () => {
            const isActive = item.classList.contains("active");
            
            // Close other items
            faqItems.forEach(other => other.classList.remove("active"));
            
            // Toggle clicked item
            if (!isActive) {
                item.classList.add("active");
            }
        });
    });
}

/* ==========================================================================
   7. COURSE SYLLABUS EXPANSIONS
   ========================================================================== */
window.toggleSyllabus = function(courseId) {
    const dropdown = document.getElementById(`syllabus-${courseId}`);
    if (dropdown) {
        dropdown.classList.toggle("expanded");
    }
};

/* ==========================================================================
   8. SYLLABUS DOWNLOAD FLOW (MODAL POPUP)
   ========================================================================== */
function initSyllabusDownload() {
    const modal = document.getElementById("syllabus-modal");
    const downloadBtns = document.querySelectorAll(".btn-download-syllabus");
    const closeModalBtn = document.getElementById("btn-close-modal");
    const downloadForm = document.getElementById("modal-download-form");
    const submitBtn = document.getElementById("btn-submit-download");
    const progressContainer = document.getElementById("download-progress-container");
    const progressFill = document.getElementById("download-progress-fill");
    const progressStatus = document.getElementById("download-progress-status");
    const successState = document.getElementById("modal-success-state");
    const modalTitle = document.getElementById("modal-title");
    
    let activeCourse = "";

    downloadBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            activeCourse = btn.getAttribute("data-course");
            modalTitle.textContent = `Get ${activeCourse} Syllabus`;
            
            // Reset modal states
            downloadForm.style.display = "block";
            progressContainer.style.display = "none";
            successState.style.display = "none";
            progressFill.style.width = "0%";
            downloadForm.reset();

            modal.classList.add("active");
        });
    });

    closeModalBtn.addEventListener("click", () => {
        modal.classList.remove("active");
    });

    // Close on overlay click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    submitBtn.addEventListener("click", () => {
        const emailInput = document.getElementById("modal-email");
        const email = emailInput.value.trim();

        // Very basic email format validation
        if (!email || !email.includes("@") || email.length < 5) {
            alert("Please enter a valid email address.");
            return;
        }

        // Hide form and show loading progress
        downloadForm.style.display = "none";
        progressContainer.style.display = "block";
        
        let width = 0;
        const statuses = [
            { limit: 25, msg: "Connecting to file server..." },
            { limit: 55, msg: "Compiling latest syllabus draft..." },
            { limit: 80, msg: "Attaching mock interview guidelines..." },
            { limit: 100, msg: "Sending PDF link to your email inbox!" }
        ];

        const interval = setInterval(() => {
            width += 2;
            progressFill.style.width = `${width}%`;
            
            // Update status text
            const currentStatus = statuses.find(s => width <= s.limit) || statuses[statuses.length - 1];
            progressStatus.textContent = currentStatus.msg;

            if (width >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    progressContainer.style.display = "none";
                    successState.style.display = "block";
                }, 400);
            }
        }, 30);
    });
}

/* ==========================================================================
   9. BOOKING REGISTRATION FUNNEL WIZARD
   ========================================================================== */
let currentBookingStep = 1;

window.goToStep = function(step) {
    // Form field validation before stepping out of Step 1
    if (currentBookingStep === 1 && step > 1) {
        const nameEl = document.getElementById("input-name");
        const emailEl = document.getElementById("input-email");
        const phoneEl = document.getElementById("input-phone");

        let hasError = false;

        // Reset errors
        document.querySelectorAll(".error-msg").forEach(el => el.textContent = "");

        if (nameEl.value.trim().length < 3) {
            document.getElementById("err-name").textContent = "Name must be at least 3 letters.";
            hasError = true;
        }
        if (!emailEl.value.trim().includes("@") || emailEl.value.trim().length < 5) {
            document.getElementById("err-email").textContent = "Please provide a valid email.";
            hasError = true;
        }
        
        const phoneVal = phoneEl.value.trim();
        const phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(phoneVal)) {
            document.getElementById("err-phone").textContent = "Phone number must be exactly 10 digits.";
            hasError = true;
        }

        if (hasError) return;
    }

    // Visual indicators updates
    document.querySelectorAll(".form-step").forEach(el => el.classList.remove("active"));
    document.getElementById(`form-step-${step}`).classList.add("active");

    const dots = document.querySelectorAll(".step-dot");
    dots.forEach((dot, idx) => {
        const dotStep = parseInt(dot.getAttribute("data-step"));
        if (dotStep <= step) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });

    currentBookingStep = step;
};

window.submitBookingForm = function() {
    const agreeCheck = document.getElementById("agree-terms");
    const termsErr = document.getElementById("err-terms");
    
    termsErr.textContent = "";
    if (!agreeCheck.checked) {
        termsErr.textContent = "You must agree to get contact schedule notifications.";
        return;
    }

    // Collect values
    const nameVal = document.getElementById("input-name").value.trim();
    const emailVal = document.getElementById("input-email").value.trim();
    const courseEl = document.getElementById("select-course");
    const courseText = courseEl.options[courseEl.selectedIndex].text.split(" (")[0];
    const slotEl = document.getElementById("select-slot");
    const slotText = slotEl.options[slotEl.selectedIndex].text.split(" (")[0];

    // Inject values into Success Card
    document.getElementById("success-student-name").textContent = nameVal;
    document.getElementById("success-course").textContent = courseText;
    document.getElementById("success-time").textContent = slotText;
    document.getElementById("success-email").textContent = emailVal;

    // Transition to Success Step
    document.querySelectorAll(".form-step").forEach(el => el.classList.remove("active"));
    document.getElementById("form-step-success").classList.add("active");

    // Hide steps wizard tracker
    document.querySelector(".form-steps-indicator").style.display = "none";
};

window.resetBookingForm = function() {
    const form = document.getElementById("booking-wizard-form");
    form.reset();
    
    // Reset wizard tracker
    document.querySelector(".form-steps-indicator").style.display = "flex";
    
    // Jump back to step 1
    goToStep(1);
};

/* ==========================================================================
   10. STUDENT PORTAL LOGIN MODAL
   ========================================================================== */
function initLoginModal() {
    const modal = document.getElementById("login-modal");
    const loginTrigger = document.getElementById("btn-login-trigger");
    const mobileLoginTrigger = document.getElementById("btn-mobile-login-trigger");
    const closeModalBtn = document.getElementById("btn-close-login-modal");
    const loginForm = document.getElementById("modal-login-form");
    const submitBtn = document.getElementById("btn-submit-login");
    const progressContainer = document.getElementById("login-progress-container");
    const progressFill = document.getElementById("login-progress-fill");
    const progressStatus = document.getElementById("login-progress-status");
    const successState = document.getElementById("login-success-state");

    const openModal = () => {
        loginForm.style.display = "block";
        progressContainer.style.display = "none";
        successState.style.display = "none";
        progressFill.style.width = "0%";
        loginForm.reset();
        modal.classList.add("active");
        
        // Close mobile nav drawer if active
        const mobileNav = document.getElementById("mobile-nav");
        const hamburger = document.getElementById("menu-hamburger-btn");
        if (mobileNav) mobileNav.classList.remove("active");
        if (hamburger) hamburger.classList.remove("active");
    };

    if (loginTrigger) loginTrigger.addEventListener("click", openModal);
    if (mobileLoginTrigger) mobileLoginTrigger.addEventListener("click", openModal);

    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    }

    // Close on overlay click
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    }

    if (submitBtn) {
        submitBtn.addEventListener("click", () => {
            const emailInput = document.getElementById("login-email");
            const passInput = document.getElementById("login-password");
            const email = emailInput.value.trim();
            const pass = passInput.value.trim();

            if (!email || email.length < 3) {
                alert("Please enter a valid email or Student ID.");
                return;
            }
            if (!pass || pass.length < 4) {
                alert("Password must be at least 4 characters long.");
                return;
            }

            // Hide form and show verification progress
            loginForm.style.display = "none";
            progressContainer.style.display = "block";
            
            let width = 0;
            const statuses = [
                { limit: 30, msg: "Connecting to student registry..." },
                { limit: 65, msg: "Authenticating token credentials..." },
                { limit: 90, msg: "Fetching learning portal states..." },
                { limit: 100, msg: "Done! Launching student dashboard..." }
            ];

            const interval = setInterval(() => {
                width += 4;
                progressFill.style.width = `${width}%`;
                
                const currentStatus = statuses.find(s => width <= s.limit) || statuses[statuses.length - 1];
                progressStatus.textContent = currentStatus.msg;

                if (width >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        progressContainer.style.display = "none";
                        successState.style.display = "block";
                        
                        // Auto-close modal after 2 seconds to simulate redirecting
                        setTimeout(() => {
                            modal.classList.remove("active");
                        }, 1800);
                    }, 400);
                }
            }, 40);
        });
    }
}

/* ==========================================================================
   11. TESTIMONIALS SLIDER CAROUSEL ("changing its own")
   ========================================================================== */
function initTestimonialSlider() {
    const container = document.getElementById("testimonials-container");
    const dots = document.querySelectorAll("#testimonial-dots .dot-indicator");
    const cards = document.querySelectorAll(".testimonial-card");
    
    if (!container || cards.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const intervalTime = 3000; // 3 seconds per slide

    const showSlide = (index) => {
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        
        currentIndex = index;
        
        // Translate the grid container horizontally
        container.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dots state
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    };

    const startAutoplay = () => {
        stopAutoplay(); // clear existing if any
        autoplayTimer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, intervalTime);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    // Attach click events to dots
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-index"));
            showSlide(index);
            startAutoplay(); // Reset timer upon user action
        });
    });

    // Pause autoplay on hover over testimonials
    const wrapper = document.querySelector(".testimonials-slider-wrapper");
    if (wrapper) {
        wrapper.addEventListener("mouseenter", stopAutoplay);
        wrapper.addEventListener("mouseleave", startAutoplay);
    }

    // Start
    startAutoplay();
}

/* ==========================================================================
   12. HERO PLACEMENT SLIDER CAROUSEL ("one time one only")
   ========================================================================== */
function initHeroSlider() {
    const track = document.getElementById("hero-slider-track");
    const dots = document.querySelectorAll("#hero-slider-dots .hero-dot");
    const slides = document.querySelectorAll(".hero-slide");
    
    if (!track || slides.length === 0) return;

    let currentIndex = 0;
    let autoplayTimer = null;
    const intervalTime = 3000; // 3 seconds per slide

    const showSlide = (index) => {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        
        currentIndex = index;
        
        // Translate track
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        
        // Update dot states
        dots.forEach((dot, idx) => {
            if (idx === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    };

    const startAutoplay = () => {
        stopAutoplay();
        autoplayTimer = setInterval(() => {
            showSlide(currentIndex + 1);
        }, intervalTime);
    };

    const stopAutoplay = () => {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    };

    // Attach click events to dots
    dots.forEach(dot => {
        dot.addEventListener("click", () => {
            const index = parseInt(dot.getAttribute("data-slide"));
            showSlide(index);
            startAutoplay(); // Reset timer upon user action
        });
    });

    // Pause on hover
    const container = document.querySelector(".hero-slider-container");
    if (container) {
        container.addEventListener("mouseenter", stopAutoplay);
        container.addEventListener("mouseleave", startAutoplay);
    }

    // Start
    startAutoplay();
}



