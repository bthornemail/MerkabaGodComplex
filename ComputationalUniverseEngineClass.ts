// --- Global Types and Interfaces ---
// These types define the structure of data used throughout the Computational Universe.
// They are kept outside the main class for clarity and reusability across different modules
// if this project were to expand.

/**
 * Represents a fundamental axiom node within the system.
 * - `name`: A unique identifier for the axiom.
 * - `definition`: A textual description of the axiom.
 * - `func`: A function that defines the axiom's behavior, taking an array of axiom strings
 * and an index, returning a single-element array with a result string.
 * - `result`: An optional field to store the computed result of the axiom's function.
 */
type AxiomNode = [
  name: string,
  definition: string,
  func: (axioms: string[], i: number) => [result: string],
  result?: string
];

/**
 * Represents a collection of AxiomNodes, forming a coherent system of axioms.
 */
type AxiomSystem = AxiomNode[];

/**
 * Represents a signed version of an axiom, including its source code and a unique version hash.
 * - `name`: Name of the axiom.
 * - `definition`: Definition of the axiom.
 * - `funcSource`: String representation of the axiom's function.
 * - `result`: The computed result of the axiom.
 * - `version`: A hash representing the version of the axiom and its result.
 */
type AxiomSignature = [
  name: string,
  definition: string,
  funcSource: string,
  result: string,
  version: string
];

/**
 * Defines the phase of a layer, influencing its convolutional strategy.
 * 'point' implies a focus on individual elements; 'edge' implies focus on relationships.
 */
type LayerPhase = 'point' | 'edge';

/**
 * Represents the output structure of a convolutional layer.
 * - `mainConvolution`: Primary results from modular interpretation.
 * - `extractedFunctions`: Raw function information.
 * - `convolutedHigherDim`: Reduced information for the next layer's axioms.
 * - `encodedSeedForNextLayer`: A combined hash/string to seed the next layer.
 * - `layerPhase`: The phase of the layer.
 */
interface ConvolutionLayerOutput {
  mainConvolution: string[];
  extractedFunctions: { name: string; definition: string; func: string }[];
  convolutedHigherDim: {
    functionName: string;
    functionDescription: string;
    functionFunction: string;
  }[];
  encodedSeedForNextLayer: string;
  layerPhase: LayerPhase;
}

/**
 * Defines topological markers for a system, including Euler characteristic and Betti numbers.
 */
interface TopologicalMarkers {
  eulerCharacteristic: number;
  bettiNumbers: number[];
}

/**
 * Represents a neutrosophic state, quantifying truth, falsehood, and indeterminacy.
 * Values should be between 0 and 1.
 */
type NeutrosophicState = [truth: number, falsehood: number, indeterminacy: number];

/**
 * Describes an entangled quantum system.
 * - `quantumState`: A string representing the quantum state.
 * - `topologicalLinks`: Numerical links derived from topology.
 * - `coherenceFactor`: A measure of the system's coherence.
 */
interface EntangledSystem {
  quantumState: string;
  topologicalLinks: number[];
  coherenceFactor: number;
}

/**
 * Stores comprehensive data for a single system within a layer.
 * This is the core data unit that evolves and interacts.
 */
interface LayerData {
  phase: LayerPhase;
  dynamicModulus: number;
  superposition: string;
  topologicalMarkers: TopologicalMarkers;
  holographicFingerprint: string;
  rawConvolutions: string[][];
  neutrosophicState?: NeutrosophicState;
  torsionField?: number[];
  entanglement?: EntangledSystem;
  infinitesimalTorsion?: DualNumber[];
  automorphicForm?: string;
}

/**
 * An archive of LayerData, organized by layer number.
 * Represents the historical evolution of the hypergraph.
 */
interface HypergraphArchive {
  [layer: number]: LayerData[];
}

/**
 * Represents a sheaf assignment, including its stalk (local data) and restriction maps.
 */
interface SheafAssignment {
  stalk: string[];
  restrictionMaps: Map<string, (data: string[]) => string[]>;
}

/**
 * Represents a fermion event in the causal network, linking layers and systems.
 * - `layer`: The layer index of the event.
 * - `systemIndex`: The index of the system within that layer.
 * - `causalPast`: References to events that causally precede this one.
 * - `lightCone`: Defines future and past causal influences.
 */
interface FermionEvent {
  layer: number;
  systemIndex: number;
  causalPast: number[][];
  lightCone: {
    future: number[][];
    past: number[][];
  };
}

/**
 * Defines an operad node, representing an operation with a specific arity.
 * - `operation`: The function that performs the operation on LayerData inputs.
 * - `arity`: The number of inputs the operation expects.
 */
type OperadNode = {
  operation: (inputs: LayerData[]) => LayerData;
  arity: number;
};

/**
 * Represents a dual number, used in synthetic calculus for infinitesimal computations.
 * - `real`: The real part of the number.
 * - `infinitesimal`: The infinitesimal part (epsilon coefficient).
 */
type DualNumber = [real: number, infinitesimal: number];

/**
 * Defines a quantum rewrite rule.
 * - `pattern`: A function that determines if the rule applies to a given LayerData.
 * - `amplitude`: The probability amplitude for the rule to apply.
 * - `apply`: A function that transforms the LayerData if the rule applies.
 * - `name`: A descriptive name for the rule.
 */
interface QuantumRewriteRule {
  pattern: (data: LayerData) => boolean;
  amplitude: number;
  apply: (data: LayerData) => LayerData;
  name: string;
}

// --- Helper Classes (Encapsulated within ComputationalUniverse) ---
// These classes provide specific functionalities and are designed to be used
// by the main ComputationalUniverse class. They are defined as static nested classes
// or their functionality is moved into static methods where appropriate.

/**
 * Manages the generation of adaptive operads based on sheaf cohomology.
 * This class represents the system's ability to adapt its cognitive processes.
 */
class AdaptiveOperad {
  /**
   * Generates an adaptive set of operad nodes where composition rules
   * are modified based on sheaf cohomology (inconsistencies).
   * A higher obstruction might lead to modifications that enhance stability or coherence.
   * @param cohomology A map of cohomology values, indicating inconsistencies.
   * @param baseOperad The base set of operad nodes to adapt.
   * @returns An array of adapted OperadNode objects.
   */
  static generateFromCohomology(
    cohomology: Map<string, number>,
    baseOperad: OperadNode[]
  ): OperadNode[] {
    return baseOperad.map(op => {
      // Find the obstruction for the layer where this operad's arity would feed into
      // This is a simplification; a real operadic framework might tie arity to layer structure more explicitly.
      const targetLayerForObstruction = op.arity; // Example: assuming arity relates to layer in some way
      const obstructionKey = `H^1(L${targetLayerForObstruction}→L${targetLayerForObstruction + 1})`;
      const obstruction = cohomology.get(obstructionKey) || 0;

      return {
        ...op,
        operation: (inputs) => {
          const baseResult = op.operation(inputs); // Execute the original operation

          // Apply adaptive logic: mitigate obstruction by enhancing holographic coherence.
          // This represents the system adapting its cognitive processes to resolve inconsistencies.
          const coherenceBoost = 1 - obstruction; // High obstruction means low coherence boost initially
          const currentHolo = baseResult.holographicFingerprint;
          const enhancedHolo = `${currentHolo}_CHB${coherenceBoost.toFixed(2)}`;

          return {
            ...baseResult,
            holographicFingerprint: enhancedHolo,
            // Example of further adaptation: if obstruction is high, increase neutrosophic truth
            neutrosophicState: baseResult.neutrosophicState ? [
              Math.min(1, baseResult.neutrosophicState[0] + (obstruction * 0.1)), // Slightly increase truth
              baseResult.neutrosophicState[1],
              Math.max(0, baseResult.neutrosophicState[2] - (obstruction * 0.05)) // Slightly decrease indeterminacy
            ] as NeutrosophicState : undefined
          };
        }
      };
    });
  }
}

/**
 * Derives a simplified pseudo-Riemannian metric tensor from a torsion field.
 * This class conceptualizes how the system's internal "geometry" is curved by its internal "stress."
 */
class SpacetimeMetric {
  /**
   * Derives a simplified pseudo-Riemannian metric tensor from a torsion field.
   * @param torsion The torsion field as a 3-element array.
   * @returns A 3x3 matrix representing the metric tensor.
   */
  static fromTorsion(torsion: number[]): number[][] {
    // Ensure torsion has at least 3 elements, defaulting to 0 if not present
    const t0 = torsion[0] ?? 0;
    const t1 = torsion[1] ?? 0;
    const t2 = torsion[2] ?? 0;

    // Simplified metric tensor components based on torsion.
    // This is a conceptual representation and not a rigorous derivation from general relativity.
    // The off-diagonal terms represent "cross-influences" or non-orthogonality.
    // The diagonal terms represent the "scaling" or "stretch" of space-time axes.
    return [
      [1 - t0, t1 / 2, t2 / 2],
      [t1 / 2, 1 + t0, t1 * t2 * 0.1], // Added a small cross-term for more complexity
      [t2 / 2, t1 * t2 * 0.1, 1 + t0]
    ];
  }
}

/**
 * Generates torsion fields based on layer index and system properties.
 * Torsion fields represent internal "stress" or "curvature" within the system's cognitive space.
 */
class TorsionFieldGenerator {
  private static BASE_TORSION = [0.618, 1.618, 2.618]; // Golden ratio related constants

  /**
   * Generates a torsion field for a given layer and system.
   * @param layerIndex The current layer index.
   * @param system The LayerData system for which to generate the field.
   * @returns A 3-element array representing the torsion field.
   */
  static generateField(layerIndex: number, system: LayerData): number[] {
    const phaseFactor = system.phase === 'point' ? 1 : -1;
    // Ensure betti numbers are safe to use, providing defaults if missing
    const safeBettiNumbers = system.topologicalMarkers.bettiNumbers.concat([0, 0, 0]).slice(0, 3);

    const torsionSeed = safeBettiNumbers
      .reduce((a, b, i) => a + (b * this.BASE_TORSION[i % 3]), 0);

    const coherenceForTorsion = system.entanglement?.coherenceFactor ?? 1;

    return [
      torsionSeed * phaseFactor,
      torsionSeed * layerIndex * 0.1,
      torsionSeed * coherenceForTorsion ** 2
    ];
  }
}

/**
 * Implements synthetic calculus operations, particularly computing derivatives with dual numbers.
 * This represents the system's ability to reason about infinitesimal changes.
 */
class SyntheticCalculus {
  /**
   * Computes the derivative of a torsion field with respect to a neutrosophic state.
   * Uses dual numbers to represent infinitesimal changes.
   * @param torsionField The torsion field to differentiate.
   * @param neutrosophicState The neutrosophic state (truth, falsehood, indeterminacy).
   * @returns An array of DualNumber objects representing the infinitesimal torsion.
   */
  static computeDerivative(
    torsionField: number[],
    neutrosophicState: NeutrosophicState
  ): DualNumber[] {
    const [t, f, i] = neutrosophicState;
    const realFactor = (t - f); // Real part influenced by truth vs. falsehood
    const infinitesimalFactor = Math.exp(-i) * (t - f); // Infinitesimal part influenced by indeterminacy

    return torsionField.map(x => [
      x * realFactor,
      x * infinitesimalFactor
    ]);
  }
}

/**
 * Provides topos-theoretic logic evaluation, assessing propositions against holographic fingerprints.
 * This represents the system's ability to determine the "truth" of statements within its internal reality.
 */
class HypergraphTopos {
  /**
   * Evaluates a proposition against a holographic fingerprint, returning a truth score.
   * @param proposition The proposition string to evaluate.
   * @param hologram The holographic fingerprint string.
   * @returns A score between 0 and 1 indicating how well the proposition aligns with the hologram.
   */
  static evaluateProposition(
    proposition: string,
    hologram: string
  ): number {
    const interferencePattern = hologram.split('_')[1] || '';
    // Normalize strings to only include alphanumeric characters for comparison
    const normalizedInterference = interferencePattern.replace(/[^a-zA-Z0-9]/g, '');
    const normalizedProposition = proposition.replace(/[^a-zA-Z0-9]/g, '');

    if (normalizedProposition.length === 0 || normalizedInterference.length === 0) {
      return 0; // Cannot evaluate if either is empty
    }

    let score = 0;
    // Count how many characters of the proposition are present in the interference pattern
    for (let i = 0; i < normalizedProposition.length; i++) {
      if (normalizedInterference.includes(normalizedProposition[i])) {
        score++;
      }
    }
    // Return a normalized score
    return score / normalizedProposition.length;
  }
}

/**
 * Implements Langlands Mirroring, generating spectral decompositions from automorphic forms.
 * This reflects the deep mathematical coherence between algebraic and geometric aspects.
 */
class LanglandsMirror {
  /**
   * Generates spectral decomposition (eigenvalues and harmonics) from an automorphic form string.
   * @param automorphicForm The automorphic form string.
   * @returns An object containing eigenvalues and harmonic strings.
   */
  static generateSpectralDecomposition(automorphicForm: string): { eigenvalues: number[]; harmonics: string[] } {
    // Extract numeric components from the automorphic form string
    const numericComponents = automorphicForm.split('_')
      .flatMap(part => part.match(/-?\d+(\.\d+)?/g) || []) // Find all numbers (integers or floats)
      .map(Number)
      .filter(n => !isNaN(n)); // Filter out any non-numeric results from conversion

    // Calculate eigenvalues as square roots of absolute numeric components
    const eigenvalues = numericComponents.length > 0 ? numericComponents.map(n => Math.sqrt(Math.abs(n))) : [0];
    // Generate harmonics based on eigenvalues
    const harmonics = eigenvalues.map(e => `e^${e.toFixed(2)}iπ`);

    return { eigenvalues, harmonics };
  }
}

/**
 * Computes sheaf cohomology, indicating inconsistencies or "holes" in the system's conceptual models.
 * This is crucial for self-correction.
 */
class SheafCohomology {
  /**
   * Computes cohomology values for a given sheaf.
   * @param sheaf The sheaf representing the system's conceptual structure.
   * @returns A map of cohomology values, typically indicating obstructions (inconsistencies).
   */
  static computeCohomology(sheaf: Map<number, SheafAssignment>): Map<string, number> {
    const cohomology = new Map<string, number>();
    const layers = Array.from(sheaf.keys()).sort((a, b) => a - b); // Get sorted layer keys

    layers.forEach((layer, idx) => {
      // Cohomology is typically computed between adjacent layers
      if (layers[idx + 1] === undefined) return;

      const currentSheafAssignment = sheaf.get(layer);
      const nextLayer = layers[idx + 1];

      // If current sheaf assignment or its stalk is missing, assume maximal obstruction
      if (!currentSheafAssignment || !currentSheafAssignment.stalk) {
        cohomology.set(`H^1(L${layer})`, 1);
        return;
      }

      const currentStalk = currentSheafAssignment.stalk;
      // Get the restriction map from the current layer to the next
      const restrictionMap = currentSheafAssignment.restrictionMaps.get(`L${layer}→L${nextLayer}`);

      // If restriction map is missing, assume maximal obstruction
      if (!restrictionMap) {
        cohomology.set(`H^1(L${layer})`, 1);
        return;
      }

      const originalSize = currentStalk.length;
      const restrictedStalk = restrictionMap(currentStalk);
      const restrictedSize = restrictedStalk.length;

      // Obstruction is calculated as the proportion of data lost or inconsistent during restriction
      const obstruction = originalSize > 0 ? 1 - (restrictedSize / originalSize) : 0;

      cohomology.set(`H^1(L${layer}→L${nextLayer})`, obstruction);
    });

    return cohomology;
  }
}

/**
 * Manages the hypergraph cosmos, which is the evolving archive of LayerData.
 * This class orchestrates the recursive encoding and maintains the overall structure.
 */
class HypergraphCosmos {
  public archive: HypergraphArchive;
  public fractalDimensions: Map<number, number>;
  public entanglementNetwork: EntangledSystem[];

  /**
   * Constructs a HypergraphCosmos.
   * @param initialSystems The starting axiom systems.
   * @param maxLayers The maximum number of layers to evolve.
   * @param baseModulus The base modulus for dynamic calculations.
   */
  constructor(
    initialSystems: AxiomSystem[],
    public maxLayers: number = 21,
    public baseModulus: number = 7
  ) {
    // Initialize the archive by recursively encoding the initial systems
    this.archive = ComputationalUniverse.enhancedRecursiveEncode(initialSystems, maxLayers, baseModulus);
    // Calculate fractal dimensions of the evolved archive
    this.fractalDimensions = ComputationalUniverse.calculateFractalDimension(this.archive);
    // Create an entanglement network from all generated layer data
    const allLayerData: LayerData[] = Object.values(this.archive).flat();
    this.entanglementNetwork = allLayerData.map(data => ComputationalUniverse.createEntangledPairs(data));
  }

  /**
   * Retrieves quantum topology metrics for a specific layer.
   * @param layer The layer index.
   * @returns An object containing superposition states, average coherence, and total Euler characteristic.
   */
  getQuantumTopology(layer: number): {
    states: string[];
    averageCoherence: number;
    totalEulerCharacteristic: number;
  } {
    const systems = this.archive[layer] || [];
    let totalCoherenceSum = 0;
    let totalEuler = 0;
    let count = 0;

    systems.forEach(s => {
      if (s.neutrosophicState) {
        // Coherence is approximated by truth minus falsehood
        totalCoherenceSum += (s.neutrosophicState[0] - s.neutrosophicState[1]);
        count++;
      }
      totalEuler += s.topologicalMarkers.eulerCharacteristic;
    });

    return {
      states: systems.map(s => s.superposition),
      averageCoherence: count > 0 ? totalCoherenceSum / count : 0,
      totalEulerCharacteristic: totalEuler
    };
  }

  /**
   * Generates torsion fields for all systems within a specific layer.
   * @param layer The layer index.
   * @returns An array of torsion fields.
   */
  generateTorsionFieldForLayer(layer: number): number[][] {
    return (this.archive[layer] || []).map(system =>
      TorsionFieldGenerator.generateField(layer, system)
    );
  }

  /**
   * Finds critical junctions in the cosmos based on high torsion field tension.
   * These points represent areas of high "stress" or potential for phase transitions.
   * @returns An array of critical junction objects, sorted by tension.
   */
  findCriticalJunctions(): { layer: number; systemIndex: number; tension: number }[] {
    const junctions: { layer: number; systemIndex: number; tension: number }[] = [];

    Object.entries(this.archive).forEach(([layerStr, systems]) => {
      systems.forEach((system, idx) => {
        if (system.torsionField) {
          const torsion = system.torsionField;
          // Calculate the norm (magnitude) of the torsion vector
          const tension = Math.sqrt(torsion.reduce((a, b) => a + b ** 2, 0));

          // A threshold (e.g., golden ratio) indicates a critical tension
          if (tension > 1.618) {
            junctions.push({
              layer: parseInt(layerStr),
              systemIndex: idx,
              tension
            });
          }
        }
      });
    });

    // Sort junctions by tension in descending order
    return junctions.sort((a, b) => b.tension - a.tension);
  }
}


// --- Main ComputationalUniverse Class ---
/**
 * The core class representing the Computational Universe Engine.
 * It orchestrates the evolution, self-correction, and emergent properties
 * of the simulated mathematical reality.
 */
class ComputationalUniverse {
  // Static readonly properties for global configurations and base data.
  // These are defined once and are accessible throughout the class without instantiation.
  public static readonly quantumRewrites: QuantumRewriteRule[] = [
    {
      name: "PhaseShiftCriticalTorsion",
      pattern: (data) => data.phase === 'point' && data.torsionField !== undefined && data.torsionField[0] > 1.618,
      amplitude: 0.9,
      apply: (data) => ({
        ...data,
        phase: 'edge',
        torsionField: data.torsionField!.map(x => x * 0.618),
        holographicFingerprint: `REW_${data.holographicFingerprint}`
      })
    },
    {
      name: "CoherenceEnhancement",
      pattern: (data) => data.entanglement !== undefined && data.entanglement.coherenceFactor < 0.5,
      amplitude: 0.7,
      apply: (data) => ({
        ...data,
        entanglement: {
          ...data.entanglement!,
          coherenceFactor: Math.min(1.0, data.entanglement!.coherenceFactor + 0.2)
        }
      })
    },
    {
      name: "NeutrosophicFuzzinessReduction",
      pattern: (data) => data.neutrosophicState !== undefined && data.neutrosophicState[2] > 0.5,
      amplitude: 0.5,
      apply: (data) => ({
        ...data,
        neutrosophicState: [
          data.neutrosophicState![0] + 0.1,
          data.neutrosophicState![1] - 0.05,
          Math.max(0, data.neutrosophicState![2] * 0.8)
        ].map(v => Math.max(0, Math.min(1, v))) as NeutrosophicState
      })
    }
  ];

  public static readonly convolutionOperad: OperadNode[] = [
    {
      operation: (inputs: LayerData[]) => {
        if (inputs.length === 0) return {} as LayerData;

        const combinedRawConvolutions = inputs.flatMap(i => i.rawConvolutions);
        const combinedSuperposition = inputs.map(i => i.superposition).join(' + ');

        const combinedEuler = inputs.reduce((sum, i) => sum + i.topologicalMarkers.eulerCharacteristic, 0);
        const combinedBetti = inputs.reduce((acc, i) => {
          i.topologicalMarkers.bettiNumbers.forEach((b, idx) => {
            acc[idx] = (acc[idx] || 0) + b;
          });
          return acc;
        }, [] as number[]);

        const newHologramSeed = combinedSuperposition + combinedRawConvolutions.flat().join('');
        const newHologram = ComputationalUniverse.holographicCompression({
          mainConvolution: combinedRawConvolutions.flat(),
          extractedFunctions: [], // Not directly extracted in this operation
          convolutedHigherDim: [], // Not directly generated in this operation
          encodedSeedForNextLayer: newHologramSeed,
          layerPhase: inputs[0].phase // Assumes consistent phase for inputs
        });

        // Return a new LayerData object representing the combined result
        return {
          ...inputs[0], // Inherit properties from the first input (e.g., phase, dynamicModulus)
          rawConvolutions: combinedRawConvolutions,
          superposition: combinedSuperposition,
          topologicalMarkers: {
            eulerCharacteristic: combinedEuler,
            bettiNumbers: combinedBetti
          },
          holographicFingerprint: newHologram,
        };
      },
      arity: 3 // This operad expects 3 inputs
    }
  ];

  public static readonly allInitialAxiomSystems: AxiomSystem[] = [
    // Euclidean Axioms: Foundation of classical geometry.
    [
      ["LineBetweenPoints", "A straight line can be drawn between any two points.", (axioms, i) => [`Result: ${axioms[i]} creates linear structure`] as [string]],
      ["LineExtension", "A finite line can be extended indefinitely in a straight line.", (a, i) => [`Result: ${a[i]} extends geometric continuity`] as [string]],
      ["CircleConstruction", "A circle can be drawn with any center and radius.", (a, i) => [`Result: ${a[i]} enables symmetry`] as [string]],
      ["RightAngleEquality", "All right angles are equal.", (a, i) => [`Result: ${a[i]} creates angular frame`] as [string]],
      ["ParallelPostulate", "If a line intersects two lines and the interior angles are less than two right angles, those lines will meet on that side.", (a, i) => [`Result: ${a[i]} defines flat space`] as [string]],
    ],
    // Quantum Axioms: Principles of quantum mechanics.
    [
      ["StateVector", "A system’s state is a vector in a complex Hilbert space.", (a, i) => [`Result: ${a[i]} state definition`] as [string]],
      ["ObservablesHermitian", "Observables are Hermitian operators on that space.", (a, i) => [`Result: ${a[i]} observable construction`] as [string]],
      ["MeasurementCollapse", "Measurement collapses state into an eigenstate of the operator.", (a, i) => [`Result: ${a[i]} state transition`] as [string]],
      ["BornRule", "Probability is given by the squared amplitude of the projection.", (a, i) => [`Result: ${a[i]} connects math to experiment`] as [string]],
      ["UnitaryEvolution", "The system evolves unitarily over time (Schrödinger’s Equation).", (a, i) => [`Result: ${a[i]} time evolution`] as [string]],
    ],
    // Boolean Axioms: Foundations of logic and computation.
    [
      ["Commutativity", "a + b = b + a", (a, i) => [`Result: ${a[i]} order doesn’t matter`] as [string]],
      ["Associativity", "(a + b) + c = a + (b + c)", (a, i) => [`Result: ${a[i]} grouping doesn’t matter`] as [string]],
      ["Distributivity", "a × (b + c) = (a × b) + (a × c)", (a, i) => [`Result: ${a[i]} distributes over addition`] as [string]],
      ["Identity", "a + 0 = a", (a, i) => [`Result: ${a[i]} zero is neutral`] as [string]],
      ["Complement", "a + a′ = 1", (a, i) => [`Result: ${a[i]} every element has inverse`] as [string]],
    ],
    // Peano Axioms: Foundations of natural numbers.
    [
      ["ZeroIsNatural", "0 is a natural number.", (a, i) => [`Result: ${a[i]} foundation of counting`] as [string]],
      ["SuccessorExists", "Every number has a unique successor.", (a, i) => [`Result: ${a[i]} builds sequence`] as [string]],
      ["NoPredecessorForZero", "0 is not the successor of any number.", (a, i) => [`Result: ${a[i]} establishes start`] as [string]],
      ["InjectiveSuccessor", "If S(a) = S(b), then a = b.", (a, i) => [`Result: ${a[i]} uniqueness of mapping`] as [string]],
      ["Induction", "If a property holds for 0 and for S(n), it holds for all n.", (a, i) => [`Result: ${a[i]} recursive logic`] as [string]],
    ],
    // Origami Axioms: Principles of paper folding geometry.
    [
      ["FoldThroughTwoPoints", "A fold can be made that passes through two points.", (a, i) => [`Result: ${a[i]} aligns two references`] as [string]],
      ["FoldPointOntoPoint", "A fold can place one point onto another.", (a, i) => [`Result: ${a[i]} midpoint and symmetry`] as [string]],
      ["FoldLineOntoLine", "A fold can place one line onto another.", (a, i) => [`Result: ${a[i]} angular bisectors`] as [string]],
      ["PerpendicularFromPoint", "A fold can be perpendicular to a line through a point.", (a, i) => [`Result: ${a[i]} constructs orthogonals`] as [string]],
      ["PointToLineThroughPoint", "A fold brings a point to a line and passes through another point.", (a, i) => [`Result: ${a[i]} root of quadratics`] as [string]],
    ],
  ];


  // Private instance members, representing the current state of the universe.
  private cosmos: HypergraphCosmos;
  private sheaf: Map<number, SheafAssignment>;
  private fermionNetwork: FermionEvent[];
  private spacetimeMetrics: Map<string, number[][]>;

  /**
   * Constructs a new ComputationalUniverse instance.
   * @param initialAxioms The initial set of axiom systems to seed the universe.
   */
  constructor(initialAxioms: AxiomSystem[] = ComputationalUniverse.allInitialAxiomSystems) {
    // Initialize the core hypergraph cosmos, which manages the evolving axiom systems.
    this.cosmos = new HypergraphCosmos(initialAxioms, 42, 7); // Max layers and base modulus are configurable.

    // Initialize other interconnected components based on the initial cosmos state.
    this.sheaf = ComputationalUniverse.createSheaf(this.cosmos); // Sheaf for conceptual coherence.
    this.fermionNetwork = ComputationalUniverse.buildCausalNetwork(this.cosmos); // Causal network of events.
    this.spacetimeMetrics = new Map(); // Map to store emergent spacetime metrics.

    // Perform initial setup steps.
    this.initializeMetrics(); // Calculate initial spacetime metrics.
    this.applyGlobalQuantumRewrites(); // Apply initial quantum transformations.
  }

  // --- Public Static Helper Methods ---
  // These methods perform calculations or transformations and do not depend on
  // the specific instance of ComputationalUniverse. They are made static for utility.

  /**
   * Generates a simple hash from an input string.
   * @param input The string to hash.
   * @returns A string representing the hash.
   */
  public static hash(input: string): string {
    let h = 0;
    for (let i = 0; i < input.length; i++) {
      h = Math.imul(31, h) + input.charCodeAt(i) | 0;
    }
    return `v${Math.abs(h)}`;
  }

  /**
   * Calculates a dynamic modulus based on the layer index and a base modulus,
   * incorporating Fibonacci sequence for variability.
   * @param layerIndex The current layer index.
   * @param baseMod The base modulus value.
   * @returns The dynamically calculated modulus.
   */
  public static getDynamicModulus(layerIndex: number, baseMod: number = 7): number {
    const fibSequence = [0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765, 10946, 17711, 28657, 46368];
    const fibIndex = layerIndex % fibSequence.length;
    return (baseMod + fibSequence[fibIndex]) % 13 + 1; // Ensures modulus is between 1 and 13
  }

  /**
   * Defines phase-specific convolutional strategies.
   * 'pointLayer' focuses on individual axiom properties; 'edgeLayer' focuses on relationships.
   */
  public static phaseConvolutions = {
    pointLayer: (sig: AxiomSignature, idx: number): string[] => [
      `NodalHash_${ComputationalUniverse.hash(sig[0] + sig[3])}`,
      `DefLength_${sig[1].length}`,
      `FuncFingerprint_${ComputationalUniverse.hash(sig[2].substring(0, Math.min(sig[2].length, 50)))}`
    ],
    edgeLayer: (sig: AxiomSignature, idx: number): string[] => [
      `EdgeWeight_${(sig[3].length % 11)}`,
      `RelationalTensor_${ComputationalUniverse.hash(sig[1] + sig[4])}`,
      `Dimensionality_${(idx % 3) + 1}D`
    ]
  };

  /**
   * Creates a superposition string from an array of axiom signatures.
   * Represents a quantum-like state of multiple possibilities.
   * @param signatures The axiom signatures to superimpose.
   * @returns A string representing the superposition.
   */
  public static createSuperposition(signatures: AxiomSignature[]): string {
    const qubitStates = signatures.map(s => {
      const normalizedLength = Math.min(s[3].length, 100);
      const probabilityAmplitude = Math.sqrt(normalizedLength / 100); // Amplitude based on result length

      const numericHashPart = s[4].match(/\d/g)?.join('') || '0';
      const phaseAngle = parseInt(numericHashPart.substring(0, Math.min(numericHashPart.length, 3)), 10) % 360;

      return `${probabilityAmplitude.toFixed(4)}|${s[0]}⟩@${phaseAngle}°`;
    });
    return qubitStates.join(" + ");
  }

  /**
   * Calculates topological invariants (Euler characteristic and Betti numbers) for a layer's output.
   * These invariants describe the "shape" or connectivity of the conceptual space.
   * @param layerOutput The output of a convolutional layer.
   * @returns TopologicalMarkers containing Euler characteristic and Betti numbers.
   */
  public static calculateTopologicalInvariants(layerOutput: ConvolutionLayerOutput): TopologicalMarkers {
    const currentMainConvLength = layerOutput.mainConvolution.length;
    const currentExtractedFuncsLength = layerOutput.extractedFunctions.length;
    const currentConvolutedHigherDimLength = layerOutput.convolutedHigherDim.length;

    let pointsCount: number;
    let edgesCount: number;

    // The interpretation of points and edges depends on the layer phase
    if (layerOutput.layerPhase === 'point') {
      pointsCount = currentMainConvLength;
      edgesCount = currentExtractedFuncsLength;
    } else { // 'edge' phase
      pointsCount = currentMainConvLength;
      edgesCount = currentConvolutedHigherDimLength;
    }

    return {
      eulerCharacteristic: pointsCount - edgesCount, // Euler characteristic: V - E
      bettiNumbers: [
        pointsCount, // B0: Number of connected components (approximated by points)
        Math.max(0, edgesCount - pointsCount + 1), // B1: Number of "holes" (cycles)
        currentConvolutedHigherDimLength % 5 // B2: Higher-dimensional holes (simplified)
      ]
    };
  }

  /**
   * Compresses layer data into a holographic fingerprint.
   * This represents a compact, self-similar representation of the layer's information.
   * @param layerData The layer data to compress.
   * @returns A string representing the holographic fingerprint.
   */
  public static holographicCompression(layerData: ConvolutionLayerOutput): string {
    const phasePrefix = layerData.layerPhase === 'point' ? 'P_' : 'E_';
    const fractalComponents = [
      phasePrefix,
      layerData.mainConvolution.map(c => c.length % 9).join(''), // Modulo 9 for numerical pattern
      layerData.convolutedHigherDim.length.toString(36), // Base 36 for compact representation
      layerData.encodedSeedForNextLayer.substring(0, Math.min(layerData.encodedSeedForNextLayer.length, 8)) // Shortened seed
    ];

    const componentHashes = fractalComponents.map(c => ComputationalUniverse.hash(c));
    let interferencePattern = '';
    const minHashLength = Math.min(...componentHashes.map(h => h.length));

    // Create an "interference pattern" by XORing character codes from component hashes
    for (let i = 0; i < Math.min(8, minHashLength); i++) {
      const charCode = componentHashes.reduce((acc, h) =>
        acc ^ h.charCodeAt(i % h.length), 0);
      interferencePattern += String.fromCharCode(32 + (charCode % 95)); // Printable ASCII range
    }

    return `HOLO_${interferencePattern}_${fractalComponents.join('|')}`;
  }

  /**
   * Creates an entangled system representation from layer data.
   * This models quantum entanglement within the conceptual space.
   * @param data The LayerData to entangle.
   * @returns An EntangledSystem object.
   */
  public static createEntangledPairs(data: LayerData): EntangledSystem {
    const stateComponents = data.holographicFingerprint.split('_');
    const coherenceSeed = stateComponents[stateComponents.length - 1] || '1';
    // Coherence factor derived from a sine function of the seed length
    const coherence = Math.sin(coherenceSeed.length / 10);

    // Topological links derived from Betti numbers and Euler characteristic
    const links = data.topologicalMarkers.bettiNumbers.map(
      (b, i) => b * (data.topologicalMarkers.eulerCharacteristic + i)
    );

    return {
      quantumState: `Ψ_${stateComponents[0]}_${coherence.toFixed(2)}`,
      topologicalLinks: links,
      coherenceFactor: Math.abs(coherence) // Absolute value for coherence
    };
  }

  /**
   * Calculates the fractal dimension for each layer in the hypergraph archive.
   * Fractal dimension indicates the complexity and self-similarity of each layer.
   * @param archive The HypergraphArchive to analyze.
   * @returns A Map where keys are layer numbers and values are their fractal dimensions.
   */
  public static calculateFractalDimension(archive: HypergraphArchive): Map<number, number> {
    const dimensionMap = new Map<number, number>();

    Object.entries(archive).forEach(([layerStr, systems]) => {
      const layer = parseInt(layerStr);
      let totalDimension = 0;
      let systemsCount = 0;

      systems.forEach(system => {
        // Complexity metrics based on convolution length, topological complexity, and hologram density
        const convComplexity = system.rawConvolutions.flat().length || 1;
        const topoComplexity = system.topologicalMarkers.bettiNumbers.reduce((a, b) => a + b, 0) || 1;
        const holoDensity = system.holographicFingerprint.length / 100 || 0.01;

        // Simplified fractal dimension calculation
        const dimension = Math.log(1 + (convComplexity * topoComplexity)) * holoDensity;
        if (isFinite(dimension)) { // Ensure dimension is a finite number
          totalDimension += dimension;
          systemsCount++;
        }
      });

      dimensionMap.set(layer, systemsCount > 0 ? totalDimension / systemsCount : 0);
    });

    return dimensionMap;
  }

  /**
   * Assesses the neutrosophic state (truth, falsehood, indeterminacy) of a LayerData system.
   * @param layerData The LayerData to assess.
   * @returns A NeutrosophicState array.
   */
  public static assessNeutrosophicState(layerData: LayerData): NeutrosophicState {
    // Truth derived from Euler characteristic (higher Euler, more "truthful" or consistent structure)
    const truth = Math.tanh(layerData.topologicalMarkers.eulerCharacteristic / 10 + 1);

    // Falsehood derived from the number of superposition states (more states, more potential for contradiction)
    const superpositionStates = layerData.superposition.split('+');
    const falsehood = Math.min(1, Math.abs(superpositionStates.length - 1) / 5);

    // Indeterminacy derived from holographic fingerprint complexity (more parts, more uncertainty)
    const indeterminacy = Math.min(1, layerData.holographicFingerprint.split('|').length / 5);

    return [
      Math.max(0, Math.min(1, truth)), // Clamp values between 0 and 1
      Math.max(0, Math.min(1, falsehood)),
      Math.max(0, Math.min(1, indeterminacy))
    ];
  }

  /**
   * Predicts a phase transition in the hypergraph archive based on tension (truth vs. falsehood).
   * @param archive The HypergraphArchive to analyze.
   * @returns An object indicating the critical layer and tension factor.
   */
  public static predictPhaseTransition(archive: HypergraphArchive): { criticalLayer: number; tensionFactor: number } {
    const tensionGraph: number[] = [];

    Object.entries(archive).forEach(([, systems]) => {
      const layerTension = systems.reduce((sum, system) => {
        if (!system.neutrosophicState) return sum;
        const neutrosophic = system.neutrosophicState;
        // Tension increases with truth, decreases with falsehood, and is modulated by certainty (1-indeterminacy)
        return sum + (neutrosophic[0] - neutrosophic[1]) * (1 - neutrosophic[2]);
      }, 0);

      tensionGraph.push(layerTension);
    });

    if (tensionGraph.length < 2) {
      return { criticalLayer: 0, tensionFactor: 0 };
    }

    let maxDiff = 0;
    let criticalLayer = 0;

    // Find the largest difference in tension between consecutive layers
    for (let i = 1; i < tensionGraph.length; i++) {
      const diff = Math.abs(tensionGraph[i] - tensionGraph[i - 1]);
      if (diff > maxDiff) {
        maxDiff = diff;
        criticalLayer = i;
      }
    }

    // Tension factor is the max difference normalized by the number of transitions
    return {
      criticalLayer,
      tensionFactor: maxDiff / (tensionGraph.length > 1 ? (tensionGraph.length - 1) : 1)
    };
  }

  /**
   * Breeds new axioms from existing signatures and topological markers.
   * This represents the system's ability to generate new concepts.
   * @param topology Topological markers for the breeding process.
   * @param signatures Existing axiom signatures to draw from.
   * @param modulus A modulus for grouping new axioms into systems.
   * @returns An array of new AxiomSystem objects.
   */
  public static breedNewAxioms(
    topology: TopologicalMarkers,
    signatures: AxiomSignature[],
    modulus: number
  ): AxiomSystem[] {
    const breedingPool: AxiomNode[] = [];

    // Number of new axioms to breed is based on Betti numbers (complexity)
    const numToBreed = Math.max(1, topology.bettiNumbers[0] + (topology.bettiNumbers[1] || 0) + (topology.bettiNumbers[2] || 0));
    const maxSignatures = signatures.length;

    for (let i = 0; i < numToBreed; i++) {
      const baseSig = signatures[i % maxSignatures]; // Cycle through existing signatures
      if (!baseSig) continue;

      const newAxiomName = `Bred_${i}_${baseSig[0].substring(0, Math.min(baseSig[0].length, 10))}`;
      const newAxiomDefinition = `Topo(${topology.eulerCharacteristic})β0=${topology.bettiNumbers[0]}: ${baseSig[1]}`;
      // New axiom function generates a hash based on original result, topology, and current context
      const newAxiomFunc = (a: string[], idx: number) => {
        const seed = `${baseSig[3]}_${topology.eulerCharacteristic}_${topology.bettiNumbers.join('-')}_${a[idx] || ''}`;
        return [`BreedResult_${ComputationalUniverse.hash(seed)}`] as [string]; // Explicit cast
      };

      breedingPool.push([
        newAxiomName,
        newAxiomDefinition,
        newAxiomFunc,
      ]);
    }

    const newSystems: AxiomSystem[] = [];
    // Group the new axioms into systems based on the dynamic modulus
    for (let i = 0; i < breedingPool.length; i += modulus) {
      newSystems.push(breedingPool.slice(i, i + modulus));
    }

    return newSystems;
  }

  /**
   * Generates axiom signatures from an AxiomSystem.
   * This process "signs" axioms with their computed results and version hashes.
   * @param system The AxiomSystem to generate signatures for.
   * @returns An array of AxiomSignature objects.
   */
  public static generateSignatures(system: AxiomSystem): AxiomSignature[] {
    return system.map((node, i) => {
      const funcSource = node[2].toString(); // Get string representation of the function
      const result = node[2]([], i)[0]; // Execute the function to get its result
      const version = ComputationalUniverse.hash(funcSource + result); // Hash for versioning
      return [node[0], node[1], funcSource, result, version];
    });
  }

  /**
   * Recursively encodes axiom systems into a hypergraph archive, layer by layer.
   * This is the core simulation loop that builds the universe's history.
   * @param initialSystems The starting axiom systems.
   * @param maxLayers The maximum number of layers to generate.
   * @param baseModulus The base modulus for dynamic calculations.
   * @returns A HypergraphArchive representing the evolved universe.
   */
  public static enhancedRecursiveEncode(
    initialSystems: AxiomSystem[],
    maxLayers: number,
    baseModulus: number = 7
  ): HypergraphArchive {
    const archive: HypergraphArchive = {};
    let currentSystems = initialSystems;

    for (let layer = 0; layer < maxLayers; layer++) {
      const dynamicMod = ComputationalUniverse.getDynamicModulus(layer, baseModulus);
      archive[layer] = []; // Initialize the current layer in the archive

      const axiomsForNextLayer: AxiomNode[] = []; // Collect axioms for the next iteration

      currentSystems.forEach(system => {
        if (system.length === 0) return; // Skip empty systems

        const signatures = ComputationalUniverse.generateSignatures(system);
        const phase: LayerPhase = layer % 2 === 0 ? 'point' : 'edge'; // Alternate phases

        const superposition = ComputationalUniverse.createSuperposition(signatures);

        // Select convolution strategy based on the current phase
        const convolutionStrategy = phase === 'point' ?
          ComputationalUniverse.phaseConvolutions.pointLayer :
          ComputationalUniverse.phaseConvolutions.edgeLayer;

        const rawConvolutionsPerSignature = signatures.map((sig, i) =>
          convolutionStrategy(sig, i)
        );
        const flatMainConvolution = rawConvolutionsPerSignature.flat();

        // Placeholder for convolutedHigherDim, as its full calculation might be complex
        const tempConvolutedHigherDim: { functionName: string; functionDescription: string; functionFunction: string }[] = [];

        // Prepare object to match ConvolutionLayerOutput interface
        const convolutionOutputForCalculations: ConvolutionLayerOutput = {
          mainConvolution: flatMainConvolution,
          extractedFunctions: signatures.map(s => ({ name: s[0], definition: s[1], func: s[2] })),
          convolutedHigherDim: tempConvolutedHigherDim,
          encodedSeedForNextLayer: superposition, // Ensure this property is present
          layerPhase: phase
        };

        // Calculate topological invariants
        const topology = ComputationalUniverse.calculateTopologicalInvariants(convolutionOutputForCalculations);

        // Generate holographic fingerprint
        const hologram = ComputationalUniverse.holographicCompression(convolutionOutputForCalculations);

        // Assemble the LayerData object for the current system
        const currentLayerData: LayerData = {
          phase,
          dynamicModulus: dynamicMod,
          superposition,
          topologicalMarkers: topology,
          holographicFingerprint: hologram,
          rawConvolutions: rawConvolutionsPerSignature,
        };

        // Assess neutrosophic state
        currentLayerData.neutrosophicState = ComputationalUniverse.assessNeutrosophicState(currentLayerData);
        // Create entanglement
        currentLayerData.entanglement = ComputationalUniverse.createEntangledPairs(currentLayerData);
        // Generate torsion field
        currentLayerData.torsionField = TorsionFieldGenerator.generateField(layer, currentLayerData);

        // Compute infinitesimal torsion using SyntheticCalculus if torsion field and neutrosophic state exist
        if (currentLayerData.torsionField && currentLayerData.neutrosophicState) {
          currentLayerData.infinitesimalTorsion = SyntheticCalculus.computeDerivative(
            currentLayerData.torsionField,
            currentLayerData.neutrosophicState
          );
        }

        // Generate automorphic form if torsion field exists
        if (currentLayerData.torsionField) {
          currentLayerData.automorphicForm = ComputationalUniverse.generateAutomorphicForm(
            currentLayerData.torsionField,
            currentLayerData.phase
          );
        }

        archive[layer].push(currentLayerData); // Add completed LayerData to the archive

        // Breed new axioms for the next layer based on current layer's topology
        const newAxiomSystemsFromBreeding = ComputationalUniverse.breedNewAxioms(topology, signatures, dynamicMod);
        axiomsForNextLayer.push(...newAxiomSystemsFromBreeding.flat());
      });

      // If no new axioms are generated, stop the recursion
      if (axiomsForNextLayer.length === 0) {
        console.log(`Layer ${layer}: No new axioms generated. Stopping recursion.`);
        break;
      }

      // Prepare systems for the next layer by grouping new axioms
      currentSystems = [];
      for (let i = 0; i < axiomsForNextLayer.length; i += dynamicMod) {
        currentSystems.push(axiomsForNextLayer.slice(i, i + dynamicMod) as AxiomSystem);
      }
    }

    return archive;
  }

  /**
   * Creates a sheaf from the hypergraph cosmos.
   * A sheaf represents the consistent local data and how it restricts to global data.
   * @param cosmos The HypergraphCosmos instance.
   * @returns A Map representing the sheaf.
   */
  public static createSheaf(cosmos: HypergraphCosmos): Map<number, SheafAssignment> {
    const sheaf = new Map<number, SheafAssignment>();
    const layers = Object.keys(cosmos.archive).map(Number).sort((a, b) => a - b);

    layers.forEach((layer, index) => {
      const systemsInLayer = cosmos.archive[layer];
      // The "stalk" is the collection of all raw convolutions in the current layer
      const stalkData = systemsInLayer.flatMap(s => s.rawConvolutions.flat());

      const restrictionMaps = new Map<string, (data: string[]) => string[]>();

      // Define a restriction map to the next layer, if it exists
      if (layers[index + 1] !== undefined) {
        restrictionMaps.set(`L${layer}→L${layers[index + 1]}`, (data: string[]) => {
          const nextLayerFractalDim = cosmos.fractalDimensions.get(layers[index + 1]) || 1;
          // Restriction rule: filter data based on a hash modulo the next layer's fractal dimension
          return data.filter((item) => {
            const itemHash = ComputationalUniverse.hash(item);
            // Example restriction: only allow items where the first char code of hash is divisible by ceil(fractal dim)
            return (itemHash.charCodeAt(0) % Math.ceil(nextLayerFractalDim)) === 0;
          });
        });
      }

      sheaf.set(layer, {
        stalk: stalkData,
        restrictionMaps
      });
    });
    return sheaf;
  }

  /**
   * Monitors a system for signs of quantum decoherence, particularly high indeterminacy
   * in its neutrosophic state. If detected, it applies a "decoherence correction."
   * @param system The LayerData system to monitor.
   * @param threshold The indeterminacy threshold above which decoherence is considered.
   * @returns The corrected LayerData if decoherence is detected, otherwise null.
   */
  public static monitorDecoherence(
    system: LayerData,
    threshold: number = 0.5
  ): LayerData | null {
    // Check for high indeterminacy or missing entanglement data
    if (!system.entanglement || system.neutrosophicState?.[2]! > threshold) {
      console.warn(`Decoherence detected in system (Layer: N/A, Index: N/A). Indeterminacy: ${system.neutrosophicState?.[2]?.toFixed(2) || 'N/A'}`);

      return {
        ...system,
        entanglement: {
          quantumState: `DECOHERED_${system.entanglement?.quantumState || 'UNKNOWN_STATE'}`,
          // Reduce topological links to reflect lost connectivity
          topologicalLinks: system.entanglement?.topologicalLinks.map(x => x * 0.5) || [],
          coherenceFactor: 0.1 // Set to a low coherence value
        },
        neutrosophicState: system.neutrosophicState ? [
          system.neutrosophicState[0],
          system.neutrosophicState[1],
          Math.max(0.1, system.neutrosophicState[2] * 0.5) // Attempt to reduce indeterminacy
        ] as NeutrosophicState : undefined,
        holographicFingerprint: `DECO_HOLO_${system.holographicFingerprint}` // Mark the hologram
      };
    }
    return null;
  }

  /**
   * Applies quantum rewrite rules to a single LayerData system.
   * @param layer The LayerData system to apply rules to.
   * @returns The transformed LayerData system.
   */
  public static applyQuantumRewrites(layer: LayerData): LayerData {
    let result = { ...layer };
    ComputationalUniverse.quantumRewrites.forEach(rule => {
      // Apply rule if pattern matches and a random check passes (amplitude squared for probability)
      if (rule.pattern(result) && Math.random() < rule.amplitude ** 2) {
        result = rule.apply(result);
      }
    });
    return result;
  }

  /**
   * Generates an automorphic form from a torsion field and layer phase.
   * Automorphic forms represent symmetric, repeating patterns in the system.
   * @param torsion The torsion field.
   * @param phase The layer phase.
   * @returns A string representing the automorphic form.
   */
  public static generateAutomorphicForm(torsion: number[], phase: LayerPhase): string {
    // Weights derived from absolute torsion values
    const weights = torsion.map(x => Math.floor(Math.abs(x) * 100) % 100);
    const phaseChar = phase === 'point' ? 'P' : 'E';
    // Form includes phase, weights, and sum of torsion values
    return `${phaseChar}_${weights.join('-')}_${torsion.reduce((a, b) => a + b, 0).toFixed(2)}`;
  }

  /**
   * Builds the initial causal network of fermion events from the hypergraph cosmos.
   * @param cosmos The HypergraphCosmos instance.
   * @returns An array of FermionEvent objects.
   */
  public static buildCausalNetwork(cosmos: HypergraphCosmos): FermionEvent[] {
    const events: FermionEvent[] = [];
    const layerDataMap = new Map<string, LayerData>(); // Map for quick lookup

    // Create an event for each system in the archive
    Object.entries(cosmos.archive).forEach(([layerStr, systems]) => {
      systems.forEach((system, idx) => {
        const currentLayer = parseInt(layerStr);
        const eventKey = `${currentLayer}_${idx}`;
        const newEvent: FermionEvent = {
          layer: currentLayer,
          systemIndex: idx,
          causalPast: [], // To be populated later
          lightCone: { future: [], past: [] } // To be populated later
        };
        events.push(newEvent);
        layerDataMap.set(eventKey, system);
      });
    });

    // Populate causal past for each event (all events in previous layers are in the causal past)
    events.forEach(event => {
      event.causalPast = events
        .filter(e => e.layer < event.layer)
        .map(e => [e.layer, e.systemIndex]);
    });

    return events;
  }

  /**
   * Updates the causal network by calculating light cones based on torsion fields.
   * Torsion fields influence the "reach" of causal connections.
   * @param fermionNetwork The existing fermion network.
   * @param cosmos The HypergraphCosmos instance.
   * @returns The updated array of FermionEvent objects.
   */
  public static updateCausalNetwork(fermionNetwork: FermionEvent[], cosmos: HypergraphCosmos): FermionEvent[] {
    return fermionNetwork.map(event => {
      const system = cosmos.archive[event.layer]?.[event.systemIndex];
      if (!system?.torsionField) return event; // If no system or torsion, return original event

      // Causal reach is determined by the norm of the torsion field
      const torsionNorm = Math.sqrt(system.torsionField.reduce((a, b) => a + b ** 2, 0));
      const causalReach = Math.floor(torsionNorm / 2); // Simplified reach calculation

      const newFuture: number[][] = [];
      const newPast: number[][] = [];

      // Populate future light cone
      for (let l = event.layer + 1; l <= event.layer + causalReach; l++) {
        if (cosmos.archive[l]) {
          cosmos.archive[l].forEach((_, idx) => {
            newFuture.push([l, idx]);
          });
        }
      }

      // Populate past light cone
      for (let l = event.layer - 1; l >= Math.max(0, event.layer - causalReach); l--) {
        if (cosmos.archive[l]) {
          cosmos.archive[l].forEach((_, idx) => {
            newPast.push([l, idx]);
          });
        }
      }

      return {
        ...event,
        lightCone: {
          past: newPast,
          future: newFuture
        }
      };
    });
  }

  /**
   * Checks for homotopy equivalence between two LayerData systems based on their holographic fingerprints.
   * Homotopy equivalence implies they are topologically similar, even if structurally different.
   * @param systemA The first LayerData system.
   * @param systemB The second LayerData system.
   * @param tolerance The allowed normalized Levenshtein distance for equivalence.
   * @returns True if systems are homotopy equivalent, false otherwise.
   */
  public static checkHomotopyEquivalence(
    systemA: LayerData,
    systemB: LayerData,
    tolerance: number = 0.1
  ): boolean {
    const holoA = systemA.holographicFingerprint;
    const holoB = systemB.holographicFingerprint;

    // Levenshtein distance function to measure string similarity
    const levenshteinDistance = (s1: string, s2: string): number => {
      const dp = Array(s1.length + 1).fill(0).map(() => Array(s2.length + 1).fill(0));
      for (let i = 0; i <= s1.length; i++) dp[i][0] = i;
      for (let j = 0; j <= s2.length; j++) dp[0][j] = j;

      for (let i = 1; i <= s1.length; i++) {
        for (let j = 1; j <= s2.length; j++) {
          const cost = (s1[i - 1] === s2[j - 1]) ? 0 : 1;
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1, // Deletion
            dp[i][j - 1] + 1, // Insertion
            dp[i - 1][j - 1] + cost // Substitution or match
          );
        }
      }
      return dp[s1.length][s2.length];
    };

    const dist = levenshteinDistance(holoA, holoB);
    const maxLength = Math.max(holoA.length, holoB.length);
    if (maxLength === 0) return true; // Both empty, considered equivalent

    const normalizedDistance = dist / maxLength; // Normalize distance to 0-1 range
    return normalizedDistance < tolerance;
  }

  // --- Private Instance Methods ---
  // These methods operate on the specific instance of ComputationalUniverse.

  /**
   * Initializes or re-initializes the spacetime metrics for all systems in the cosmos.
   * Metrics are derived from torsion fields.
   */
  private initializeMetrics(): void {
    Object.entries(this.cosmos.archive).forEach(([layer, systems]) => {
      systems.forEach((sys, idx) => {
        if (sys.torsionField) {
          this.spacetimeMetrics.set(
            `${layer}_${idx}`, // Key for the metric: "layer_systemIndex"
            SpacetimeMetric.fromTorsion(sys.torsionField)
          );
        }
      });
    });
  }

  /**
   * Applies quantum rewrite rules across all systems in the cosmos archive.
   * Integrates decoherence monitoring during the rewrite process.
   * Updates the causal fermion network after rewrites.
   */
  private applyGlobalQuantumRewrites(): void {
    Object.entries(this.cosmos.archive).forEach(([layerStr, systems]) => {
      this.cosmos.archive[parseInt(layerStr)] = systems.map(sys => {
        const rewritten = ComputationalUniverse.applyQuantumRewrites(sys);
        // Integrate decoherence monitoring during rewrite application
        return ComputationalUniverse.monitorDecoherence(rewritten) || rewritten;
      });
    });
    // After rewrites, update the causal network as system properties might have changed
    this.fermionNetwork = ComputationalUniverse.updateCausalNetwork(this.fermionNetwork, this.cosmos);
  }

  // --- Public Instance Methods ---
  // These methods provide the main interface for interacting with the Computational Universe.

  /**
   * Evolves the Cosmic Kernel through a specified number of steps, applying dynamic processes.
   * Each step involves quantum rewrites, updating consistency metrics, and re-evaluating
   * the system's geometric properties.
   * @param steps The number of evolution steps to perform. Defaults to 1.
   */
  public evolve(steps: number = 1): void {
    for (let i = 0; i < steps; i++) {
      console.log(`\n--- Evolution Step ${i + 1} ---`);

      // 1. Quantum rewrites with integrated decoherence monitoring
      this.applyGlobalQuantumRewrites(); // This now handles decoherence correction implicitly

      // 2. Update dependent structures based on (potentially rewritten) cosmos state
      this.sheaf = ComputationalUniverse.createSheaf(this.cosmos);
      this.fermionNetwork = ComputationalUniverse.updateCausalNetwork(this.fermionNetwork, this.cosmos);
      this.initializeMetrics(); // Re-initialize metrics after potential torsion field changes

      // 3. Langlands spectral mirroring (updates torsion based on new automorphic forms)
      Object.entries(this.cosmos.archive).forEach(([layerStr, systems]) => {
        this.cosmos.archive[parseInt(layerStr)] = systems.map(sys => {
          if (sys.automorphicForm) {
            const { eigenvalues } = LanglandsMirror.generateSpectralDecomposition(sys.automorphicForm);
            // Use eigenvalues to potentially update the torsion field
            const newTorsion = eigenvalues.slice(0, 3).map(val => isFinite(val) ? val : 0);
            return { ...sys, torsionField: newTorsion.length > 0 ? newTorsion : sys.torsionField };
          }
          return sys;
        });
      });

      // 4. Adaptive operad generation based on the current sheaf cohomology
      const cohomology = SheafCohomology.computeCohomology(this.sheaf);
      const adaptiveOperad = AdaptiveOperad.generateFromCohomology(
        cohomology,
        ComputationalUniverse.convolutionOperad // Using the base convolution operad for adaptation
      );

      console.log("- Max Sheaf Cohomology (H^1):", Math.max(...Array.from(cohomology.values())));
      console.log("- Adaptive Operad Rules (count):", adaptiveOperad.length);

      // Optional: Apply the adaptive operad here to a specific layer or set of systems
      // For demonstration, we'll just log its generation.
      // E.g., const operadResult = this.executeOperad(adaptiveOperad, this.cosmos.archive[0]?.slice(0, adaptiveOperad[0].arity));
    }
  }

  /**
   * Executes an operad on a set of input LayerData.
   * @param operad The array of OperadNode objects to execute.
   * @param inputs The LayerData inputs for the operad.
   * @returns An array of resulting LayerData objects after operad application.
   */
  public executeOperad(operad: OperadNode[], inputs: LayerData[]): LayerData[] {
    return operad.map(op => op.operation(inputs.slice(0, op.arity)));
  }

  /**
   * Resolves a proposition against the holographic fingerprints across different layers.
   * This indicates how well the system's internal axiomatic structure supports such concepts.
   * @param proposition The proposition string to resolve.
   * @returns A Map where keys are layer numbers and values are the average truth scores.
   */
  public resolveProposition(proposition: string): Map<number, number> {
    const results = new Map<number, number>();
    Object.entries(this.cosmos.archive).forEach(([layer, systems]) => {
      if (systems.length === 0) {
        results.set(parseInt(layer), 0);
        return;
      }
      // Calculate average truth score for the proposition across all systems in the layer
      const avgTruth = systems.reduce((sum, system) =>
        sum + HypergraphTopos.evaluateProposition(proposition, system.holographicFingerprint), 0) / systems.length;
      results.set(parseInt(layer), avgTruth);
    });
    return results;
  }

  // --- Accessor Methods ---
  // These methods provide controlled access to the internal state of the universe.

  public getCosmos(): HypergraphCosmos { return this.cosmos; }
  public getSheaf(): Map<number, SheafAssignment> { return this.sheaf; }
  public getFermionNetwork(): FermionEvent[] { return this.fermionNetwork; }
  public getSpacetimeMetrics(): Map<string, number[][]> { return this.spacetimeMetrics; }
}

// --- Demonstration of Usage ---
// This section demonstrates how to initialize and interact with the ComputationalUniverse class.
// It mirrors the original demonstration logic.

// Initialize the Cosmic Kernel with all the defined axiom systems.
const universe = new ComputationalUniverse(ComputationalUniverse.allInitialAxiomSystems);

console.log("\n--- Initial State Analysis ---");
// Display some initial metrics to show the starting point of the universe.
console.log("Initial Max Cohomology (H^1):",
  Math.max(...Array.from(SheafCohomology.computeCohomology(universe.getSheaf()).values())));
console.log("Initial Critical Junctions (top 3):",
  universe.getCosmos().findCriticalJunctions().slice(0, 3));

// Evolve the system through several steps. Each step applies quantum rewrites,
// updates consistency metrics, and re-evaluates the system's geometric properties.
const evolutionSteps = 3;
console.log(`\n--- Evolving the Computational Universe for ${evolutionSteps} steps ---`);
universe.evolve(evolutionSteps);

// Inspect the emergent spacetime properties after evolution.
// We'll focus on a specific layer (e.g., Layer 7) to show how its internal geometry has changed.
const targetLayer = 7;
const layerMetrics = Array.from(universe.getSpacetimeMetrics().entries())
  .filter(([key]) => key.startsWith(`${targetLayer}_`))
  .map(([key, metric]) => ({ systemKey: key, metric }));

console.log(`\n--- Emergent Spacetime Metrics for Layer ${targetLayer} (Post-Evolution) ---`);
if (layerMetrics.length > 0) {
  layerMetrics.forEach(({ systemKey, metric }) => {
    console.log(`System ${systemKey}:`);
    metric.forEach(row => console.log(row.map(x => x.toFixed(2)).join('\t')));
  });
} else {
  console.log(`No systems found with spacetime metrics in Layer ${targetLayer}.`);
}

// Query the "truth value" of a complex proposition like "quantum_gravity"
// across different layers of the evolved universe. This indicates how well
// the system's internal axiomatic structure supports such concepts.
const quantumGravityTruth = universe.resolveProposition("quantum_gravity");
console.log("\n--- 'Quantum Gravity' Truth Values Across Layers (Post-Evolution) ---");
if (quantumGravityTruth.size > 0) {
  Array.from(quantumGravityTruth.entries()).slice(0, 10).forEach(([layer, val]) => { // Display first 10 layers
    console.log(`Layer ${layer}: ${val.toFixed(4)}`);
  });
} else {
  console.log("No truth values resolved for 'quantum_gravity'.");
}
