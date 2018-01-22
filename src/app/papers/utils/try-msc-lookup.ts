import { MscLookupService } from '../services/msc-lookup.service';

/**
 * A service to try a lookup of multiple MSC codes against the mscLookupService.
 * The lookup will only be attempted if we appear to have a real MSC code.
 *
 * Will return whether the lookups were successful. If so, the results will be stored
 * in lastMscValSet for use in the template.
 */
export class TryMscLookup {

  /**
   * Result of the last MSC lookup.
   */
  private lastMscValSet: ReadonlySet<string>;

  /**
   * Build utility class with will leverage the given MscLookupService to do its lookups.
   * @param {MscLookupService} mscLookupService
   */
  constructor(private mscLookupService: MscLookupService) {

    // Starting out, this set is empty because no "last" lookup has occurred yet.
    this.lastMscValSet = new Set<string>();
  }

  /**
   * Try a lookup of multiple MSC codes against the mscLookupService.
   * The lookup will only be attempted if we appear to have a real MSC code.
   *
   * Will return whether the lookups were successful. If so, the results will be stored
   * in lastMscValSet for use in the template.
   */
  try(mscKeys: Array<string>): boolean {

    // Make a new set of results.
    const lastMscValSet = new Set<string>();

    // No MSC, no lookup.
    if (mscKeys == null) {
      return false;
    }

    // For each key...
    mscKeys.forEach(
      ((mscKey: string) => {
        // If it doesn't match expected pattern (5 characters, starting with two numbers) - don't do the lookup.
        if (!mscKey.match(new RegExp('^\\d{2}[\\S]{3}$'))) {
          return;
        }
        // If the MSC follows the pattern digit-digit-letter-digit-digit, replace the last two digits with 'xx'.
        // This means we are looking at a super-specific MSC, and its parent rollup code is actually more interesting
        // to show to the user. After attempting this replacement, then proceed with the actual lookup.
        const mscVal = this.mscLookupService.get(
          mscKey.replace(new RegExp('^(\\d{2}[A-Z])(\\d{2})$'), '$1xx'));

        // If we have a value, add it to the set. By using a set, we ensure that only distinct items will be shown.
        if (mscVal) {
          lastMscValSet.add(mscVal);
        }
      })
    );

    // Save it.
    this.lastMscValSet = lastMscValSet;

    // Success is defined by whether there is at least one result to show.
    return this.lastMscValSet.size !== 0;
  }

  /**
   * Get the last set of MSC values looked up.
   * @return last looked up set of MSC values
   */
  get(): ReadonlySet<String> {
    return this.lastMscValSet;
  }

}
